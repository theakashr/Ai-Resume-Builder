"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FullResumeState } from "./LiveResumePaperPreview";
import { Plus, Trash2 } from "lucide-react";

export interface CertificationsFormProps {
  certifications: FullResumeState["certifications"];
  onChange: (certifications: FullResumeState["certifications"]) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onChange,
}) => {
  const handleUpdate = (id: string, field: string, value: string) => {
    const updated = certifications.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleAdd = () => {
    const newItem = {
      id: `cert-${Date.now()}`,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2023",
    };
    onChange([...certifications, newItem]);
  };

  const handleDelete = (id: string) => {
    onChange(certifications.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
          Certifications & Achievements ({certifications.length})
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          leftIcon={<Plus className="w-3.5 h-3.5 text-[#4F46E5]" />}
          className="text-xs"
        >
          Add Certification
        </Button>
      </div>

      <div className="space-y-3">
        {certifications.map((cert) => (
          <div key={cert.id} className="p-3.5 bg-white border border-[#E4E4E7] rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#09090B]">{cert.name || "Certification Name"}</span>
              <button
                onClick={() => handleDelete(cert.id)}
                className="text-[#A1A1AA] hover:text-[#EF4444] p-1 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Certification Name"
                value={cert.name}
                onChange={(e) => handleUpdate(cert.id, "name", e.target.value)}
              />
              <Input
                label="Issuing Organization"
                value={cert.issuer}
                onChange={(e) => handleUpdate(cert.id, "issuer", e.target.value)}
              />
              <Input
                label="Year Issued"
                value={cert.year}
                onChange={(e) => handleUpdate(cert.id, "year", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
