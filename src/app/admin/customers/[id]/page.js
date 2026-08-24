"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { User, ShieldCheck, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { PortalPage } from "@/components/app/portal-page";
import { DetailList, EmptyState, LoadingRows, SectionCard } from "@/components/app/primitives";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { customerService, policyService, nameOfAgent } from "@/services";
import { formatDate } from "@/lib/format";

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const id = params.id;

  const { data: customer, isLoading: customerLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.get(id),
  });

  const { data: policies, isLoading: policiesLoading } = useQuery({
    queryKey: ["customer-policies", id],
    queryFn: () => policyService.list({ customerId: id }),
    enabled: Boolean(id),
  });

  return (
    <PortalPage
      role="ADMIN"
      eyebrow="Customer Management"
      title={customer?.name ?? "Customer profile"}
      description={customer ? `${customer.id} · ${customer.city || "India"}` : undefined}
      actions={
        <Button variant="outline" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="mr-2 size-4" /> Back to customers
          </Link>
        </Button>
      }
    >
      {customerLoading ? (
        <LoadingRows rows={5} />
      ) : !customer ? (
        <EmptyState icon={User} title="Customer not found" description="No customer matching this identifier exists." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="Customer Information"
            action={<StatusBadge status={customer.status || "Active"} />}
          >
            <DetailList
              items={[
                { label: "Customer ID", value: customer.id },
                { label: "Full name", value: customer.name },
                { label: "Email address", value: customer.email },
                { label: "Phone number", value: customer.phone || "—" },
                { label: "City / Location", value: customer.city || "—" },
                { label: "Assigned advisor", value: nameOfAgent(customer.agentId) },
                { label: "KYC verification", value: <StatusBadge status={customer.kycStatus || "Verified"} /> },
                { label: "Customer since", value: formatDate(customer.createdAt || "2026-01-15") },
              ]}
            />
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Contact & Channels">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{customer.phone || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{customer.city || "Pan-India"}</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Active Policies" description="Policies held by this customer">
              {policiesLoading ? (
                <LoadingRows rows={2} />
              ) : !policies || policies.length === 0 ? (
                <p className="text-xs text-muted-foreground">No policies currently linked.</p>
              ) : (
                <ul className="space-y-2">
                  {policies.map((p) => (
                    <li key={p.id} className="rounded-lg border border-border p-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold">{p.planName}</p>
                        <p className="text-xs text-muted-foreground">{p.policyNumber}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>
        </div>
      )}
    </PortalPage>
  );
}
