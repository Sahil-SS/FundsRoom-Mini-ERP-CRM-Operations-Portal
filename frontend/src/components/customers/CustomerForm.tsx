"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  customerSchema,
  type CustomerFormValues,
} from "@/schemas/customer.schema";

import type { Customer } from "@/types/customer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerFormProps {
  mode: "create" | "edit";
  customer?: Customer;
  isSubmitting: boolean;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
  serverError?: string;
}

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function CustomerForm({
  mode,
  customer,
  isSubmitting,
  onSubmit,
  onCancel,
  serverError,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),

    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      businessName: "",
      gstNumber: "",
      type: "RETAIL",
      address: "",
      status: "LEAD",
      followUpDate: "",
      notes: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedType = watch("type");
  const selectedStatus = watch("status");

  useEffect(() => {
    if (!customer) {
      return;
    }

    reset({
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email ?? "",
      businessName: customer.businessName ?? "",
      gstNumber: customer.gstNumber ?? "",
      type: customer.type,
      address: customer.address ?? "",
      status: customer.status,
      followUpDate: toDateTimeLocal(customer.followUpDate),
      notes: customer.notes ?? "",
    });
  }, [customer, reset]);

  function handleFormSubmit(values: CustomerFormValues) {
    onSubmit({
      ...values,

      email: values.email.trim(),

      businessName: values.businessName.trim(),

      gstNumber: values.gstNumber.trim(),

      address: values.address.trim(),

      notes: values.notes.trim(),

      followUpDate: values.followUpDate
        ? new Date(values.followUpDate).toISOString()
        : "",
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-900">{serverError}</p>
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Basic Information</h3>

          <p className="mt-1 text-sm text-slate-500">
            Enter the customer&apos;s primary contact information.
          </p>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
          <FormField
            label="Customer Name"
            required
            error={errors.name?.message}
          >
            <Input placeholder="e.g. Rohan Traders" {...register("name")} />
          </FormField>

          <FormField
            label="Mobile Number"
            required
            error={errors.mobile?.message}
          >
            <Input
              placeholder="e.g. 9876543210"
              inputMode="tel"
              {...register("mobile")}
            />
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="customer@example.com"
              {...register("email")}
            />
          </FormField>

          <FormField label="Business Name" error={errors.businessName?.message}>
            <Input
              placeholder="e.g. Rohan Traders Pvt Ltd"
              {...register("businessName")}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Business Details</h3>

          <p className="mt-1 text-sm text-slate-500">
            Configure customer classification and business information.
          </p>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
          <FormField label="GST Number" error={errors.gstNumber?.message}>
            <Input
              placeholder="Optional GST number"
              {...register("gstNumber")}
            />
          </FormField>

          <FormField
            label="Customer Type"
            required
            error={errors.type?.message}
          >
            <Select
              value={selectedType}
              onValueChange={(value) =>
                setValue("type", value as CustomerFormValues["type"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="RETAIL">Retail</SelectItem>

                <SelectItem value="WHOLESALE">Wholesale</SelectItem>

                <SelectItem value="DISTRIBUTOR">Distributor</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Status" error={errors.status?.message}>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setValue("status", value as CustomerFormValues["status"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="LEAD">Lead</SelectItem>

                <SelectItem value="ACTIVE">Active</SelectItem>

                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Follow-up Date"
            error={errors.followUpDate?.message}
          >
            <Input type="datetime-local" {...register("followUpDate")} />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Address" error={errors.address?.message}>
              <Textarea
                placeholder="Customer address"
                rows={4}
                {...register("address")}
              />
            </FormField>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">CRM Notes</h3>

          <p className="mt-1 text-sm text-slate-500">
            Add context that will help the sales team manage this customer.
          </p>
        </div>

        <div className="p-5">
          <FormField label="Notes" error={errors.notes?.message}>
            <Textarea
              placeholder="Add customer notes..."
              rows={5}
              {...register("notes")}
            />
          </FormField>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Customer"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
