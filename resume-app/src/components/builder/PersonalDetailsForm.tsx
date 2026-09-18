"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { FullResumeState } from "./LiveResumePaperPreview";
import { User, Mail, Phone, MapPin, Globe, Share2 } from "lucide-react";

export interface PersonalDetailsFormProps {
  personalInfo: FullResumeState["personalInfo"];
  onChange: (updated: FullResumeState["personalInfo"]) => void;
}

export const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  personalInfo,
  onChange,
}) => {
  const handleChange = (field: keyof FullResumeState["personalInfo"], value: string) => {
    onChange({
      ...personalInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={personalInfo.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
        />
        <Input
          label="Target Job Title"
          value={personalInfo.jobTitle}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          value={personalInfo.email}
          onChange={(e) => handleChange("email", e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
        />
        <Input
          label="Phone Number"
          value={personalInfo.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          leftIcon={<Phone className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Location"
          value={personalInfo.location}
          onChange={(e) => handleChange("location", e.target.value)}
          leftIcon={<MapPin className="w-4 h-4" />}
        />
        <Input
          label="Portfolio / Website"
          value={personalInfo.website}
          onChange={(e) => handleChange("website", e.target.value)}
          leftIcon={<Globe className="w-4 h-4" />}
        />
        <Input
          label="LinkedIn Profile"
          value={personalInfo.linkedin}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          leftIcon={<Share2 className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};
