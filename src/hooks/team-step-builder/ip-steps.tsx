
import React from "react";
import { EnhancedStep } from "./types";
import { Textarea } from "@/components/ui/textarea";
import VideoEmbed from "@/components/video-player/VideoEmbed";
import FileUploader from "@/components/sprint/FileUploader";
import UploadedFileView from "@/components/sprint/UploadedFileView";

// Sample video ID - replace with actual IP/TTO video when available
const IP_TTO_VIDEO_ID = "j5TEYCrLDYo";

export const getIPSteps = (
  universityIP: boolean | undefined,
  ttoEngaged: boolean | undefined,
  formData: {
    ttoConversationSummary: string;
    preliminaryTerms: string;
    ttoEngagementPlans: string;
    patentsFilingPlans: string;
    ipOwnershipStatus: string;
  },
  patentsFiled: boolean | undefined,
  uploadedFileId: string | undefined,
  onFormDataChange: (field: string, value: string) => void,
  onPatentsFiledChange: (filed: boolean) => void,
  onFileUpload: (fileId: string) => void
): EnhancedStep[] => {
  // Start with empty steps array
  const steps: EnhancedStep[] = [];

  // Common content step for everyone
  steps.push({
    type: "content",
    context: "ip_status",
    title: "Intellectual Property Fundamentals",
    content: [
      <div key="ip-fundamentals" className="space-y-4">
        <p>You are the core asset of the company. Your expertise and vision are central to your startup's success.</p>
        <p>Intellectual property plays a crucial role in science and deep tech startups. Here's why:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>IP protects your innovations from competitors</li>
          <li>IP can be a significant asset for fundraising</li>
          <li>IP strategy should match your market validation and business strategy</li>
        </ul>
        <VideoEmbed 
          youtubeEmbedId={IP_TTO_VIDEO_ID} 
          title="Intellectual Property Strategy" 
        />
      </div>
    ]
  });

  // Conditional steps based on universityIP
  if (universityIP === true) {
    // University IP path
    steps.push({
      type: "content",
      context: "tto_status",
      title: "Tech Transfer Office (TTO) Engagement",
      content: [
        <div key="tto-info" className="space-y-4">
          <h3 className="text-lg font-medium">Working with Technology Transfer Offices</h3>
          <p>Tech Transfer Offices (TTOs) are responsible for commercializing university research and managing IP that was created using university resources.</p>
          <p>Key considerations when working with TTOs:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Understand your university's IP policy</li>
            <li>Know what IP is actually owned by the university vs. what you own</li>
            <li>Approach negotiations strategically and prepare thoroughly</li>
            <li>Consider alternative approaches if TTO terms are unfavorable</li>
          </ul>
        </div>
      ]
    });

    // TTO engagement dependent questions
    if (ttoEngaged === true) {
      steps.push({
        type: "form",
        context: "tto_status",
        title: "TTO Conversation Details",
        content: [
          <div key="tto-conversation" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Summarize your conversations with the TTO:</h3>
              <Textarea 
                value={formData.ttoConversationSummary}
                onChange={(e) => onFormDataChange('ttoConversationSummary', e.target.value)}
                placeholder="Describe the key points discussed, any concerns raised, and next steps..."
                rows={4}
                className="w-full"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">List the preliminary licensing terms (especially % equity) the TTO expects:</h3>
              <Textarea 
                value={formData.preliminaryTerms}
                onChange={(e) => onFormDataChange('preliminaryTerms', e.target.value)}
                placeholder="Detail equity percentages, royalty rates, milestone payments, etc."
                rows={4}
                className="w-full"
              />
            </div>
          </div>
        ]
      });
    } else {
      steps.push({
        type: "form",
        context: "tto_status",
        title: "TTO Engagement Plans",
        content: [
          <div key="tto-plans" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Explain your current plans for engaging with the TTO:</h3>
              <Textarea 
                value={formData.ttoEngagementPlans}
                onChange={(e) => onFormDataChange('ttoEngagementPlans', e.target.value)}
                placeholder="Outline your timeline, approach, and preparation strategy..."
                rows={4}
                className="w-full"
              />
            </div>
          </div>
        ]
      });
    }
    
    // Add deep-dive educational content for university IP
    steps.push({
      type: "content",
      context: "tto_status",
      title: "TTO Negotiation Strategy",
      content: [
        <div key="tto-strategy" className="space-y-4">
          <h3 className="text-lg font-medium">Strategic Approaches to TTO Negotiations</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Switch from employee mindset to founder of an independent company</li>
            <li>Nobody else can negotiate on your behalf effectively (not lawyers, investors, or advisors)</li>
            <li>This is a key opportunity to evolve as a founder</li>
            <li>Do not start negotiations until all your preparation is complete</li>
            <li>Consider alternative approaches if terms aren't favorable</li>
          </ul>
        </div>
      ]
    });
  } else if (universityIP === false) {
    // Non-university IP path
    steps.push({
      type: "content",
      context: "ip_status",
      title: "IP Ownership",
      content: [
        <div key="ip-ownership-question" className="space-y-4">
          <h3 className="text-lg font-medium">Do you own all the IP?</h3>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => onPatentsFiledChange(true)}
              className={`px-4 py-2 rounded ${patentsFiled === true ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}
            >
              Yes
            </button>
            <button 
              onClick={() => onPatentsFiledChange(false)}
              className={`px-4 py-2 rounded ${patentsFiled === false ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}
            >
              No
            </button>
          </div>
        </div>
      ]
    });

    // Patent status dependent questions
    if (patentsFiled === true) {
      steps.push({
        type: "content",
        context: "ip_status",
        title: "Patent Documentation",
        content: [
          <div key="patent-upload" className="space-y-4">
            <h3 className="font-medium mb-2">Upload your patent documentation</h3>
            <p className="text-sm text-gray-600 mb-4">
              This can include patent applications, granted patents, or relevant correspondence with patent offices.
            </p>
            {uploadedFileId ? (
              <UploadedFileView
                fileId={uploadedFileId}
                isCompleted={false}
              />
            ) : (
              <FileUploader
                onFileUploaded={onFileUpload}
                isCompleted={false}
              />
            )}
          </div>
        ]
      });
    } else if (patentsFiled === false) {
      steps.push({
        type: "form",
        context: "ip_status",
        title: "IP Ownership Status",
        content: [
          <div key="ip-ownership-status" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Explain the current status of IP ownership:</h3>
              <Textarea 
                value={formData.ipOwnershipStatus}
                onChange={(e) => onFormDataChange('ipOwnershipStatus', e.target.value)}
                placeholder="Describe who owns the IP, any complications or concerns, and your strategy to secure ownership..."
                rows={4}
                className="w-full"
              />
            </div>
          </div>
        ]
      });
    }
  }

  return steps;
};
