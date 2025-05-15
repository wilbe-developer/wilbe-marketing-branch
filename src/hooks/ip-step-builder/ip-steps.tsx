
import React from "react";
import { EnhancedIpStep } from "./types";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/sprint/FileUploader";
import UploadedFileView from "@/components/sprint/UploadedFileView";

export const getIpSteps = (
  reliesOnUniIp: boolean | undefined,
  ttoConversation: string,
  ttoTerms: string,
  ttoPlan: string,
  ipOwnershipStatus: string,
  patentPlans: string,
  uploadedFileId: string | undefined,
  onTtoConversationChange: (value: string) => void,
  onTtoTermsChange: (value: string) => void,
  onTtoPlanChange: (value: string) => void,
  onIpOwnershipStatusChange: (value: string) => void,
  onPatentPlansChange: (value: string) => void,
  onFileUpload: (fileId: string) => void
): EnhancedIpStep[] => {
  // Start with an empty array of steps
  const steps: EnhancedIpStep[] = [
    // Step 0: check_reliance
    {
      type: "question",
      context: "reliance",
      question: "Is the company reliant on IP created at a university?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ],
      content: []
    }
  ];

  // Add university IP path steps if reliesOnUniIp is true
  if (reliesOnUniIp === true) {
    steps.push(
      // Step: uni_ip_path
      {
        type: "question",
        context: "tto",
        question: "Have you begun conversations with the Tech Transfer Office (TTO)?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ],
        content: []
      }
    );

    // TTO conversation details for "yes" path
    steps.push(
      {
        type: "content",
        context: "tto",
        content: [
          "Summarize the conversation with the TTO.",
          <div key="tto-conversation" className="mt-4">
            <Textarea
              value={ttoConversation}
              onChange={(e) => onTtoConversationChange(e.target.value)}
              placeholder="Describe your conversations with the Tech Transfer Office..."
              rows={4}
              className="w-full"
            />
          </div>
        ]
      },
      {
        type: "content",
        context: "tto",
        content: [
          "List the preliminary licensing terms (especially % equity) the TTO expects. Include anything agreed or merely mentioned.",
          <div key="tto-terms" className="mt-4">
            <Textarea
              value={ttoTerms}
              onChange={(e) => onTtoTermsChange(e.target.value)}
              placeholder="Detail the licensing terms discussed..."
              rows={4}
              className="w-full"
            />
          </div>
        ]
      }
    );

    // TTO plan for "no" path
    steps.push(
      {
        type: "content",
        context: "tto",
        content: [
          "Explain your current plans for engaging with the TTO.",
          <div key="tto-plan" className="mt-4">
            <Textarea
              value={ttoPlan}
              onChange={(e) => onTtoPlanChange(e.target.value)}
              placeholder="Outline your plans for engaging with the Tech Transfer Office..."
              rows={4}
              className="w-full"
            />
          </div>
        ]
      }
    );
  } else if (reliesOnUniIp === false) {
    // Add non-university IP path steps
    steps.push(
      // Step: non_uni_ip_path
      {
        type: "question",
        context: "ownership",
        question: "Do you own all the IP?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ],
        content: []
      }
    );

    // IP ownership explanation for "no" path
    steps.push(
      {
        type: "content",
        context: "ownership",
        content: [
          "Explain the current status of IP ownership.",
          <div key="ip-ownership" className="mt-4">
            <Textarea
              value={ipOwnershipStatus}
              onChange={(e) => onIpOwnershipStatusChange(e.target.value)}
              placeholder="Describe the current status of IP ownership..."
              rows={4}
              className="w-full"
            />
          </div>
        ]
      }
    );

    // Patents filed
    steps.push(
      {
        type: "question",
        context: "patents",
        question: "Have patents been filed?",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ],
        content: []
      }
    );

    // Patent plans for "no" path
    steps.push(
      {
        type: "content",
        context: "patents",
        content: [
          "Explain your plans for filing patents.",
          <div key="patent-plans" className="mt-4">
            <Textarea
              value={patentPlans}
              onChange={(e) => onPatentPlansChange(e.target.value)}
              placeholder="Describe your plans for filing patents..."
              rows={4}
              className="w-full"
            />
          </div>
        ]
      }
    );

    // Patent upload for "yes" path
    steps.push(
      {
        type: "content",
        context: "patents",
        content: [
          "Upload your patent documents",
          <div key="patent-upload" className="mt-4 space-y-4">
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
      }
    );
  }

  // General content for everyone
  steps.push(
    {
      type: "content",
      context: "general",
      content: [
        "Content to cover for everyone",
        <div key="general-content" className="space-y-2 mt-4">
          <p>• You are the core asset of the company.</p>
          <p>• Role of inventions and why protecting them is crucial.</p>
          <p>• Why this IP is relevant to your business strategy.</p>
          <p>• Raising funding without foundational IP: risks & challenges.</p>
          <p>• How to define an IP strategy that matches market validation.</p>
        </div>
      ]
    }
  );

  // University-specific content
  if (reliesOnUniIp === true) {
    steps.push(
      {
        type: "content",
        context: "uni_specific",
        content: [
          "Deep-dive for uni-created IP",
          <div key="uni-specific-content" className="space-y-2 mt-4">
            <p>• What is a Tech Transfer Office (TTO)?</p>
            <p>• How do they think and evaluate inventions?</p>
            <p>• Do you actually own your IP—what does your license say?</p>
            <p>• When and how should you approach them?</p>
            <p>• Switching from an employee mindset to founder of an independent company.</p>
            <p>• Why nobody else (lawyers, investors, advisors) can negotiate on your behalf.</p>
            <p>• Why this is the best opportunity to evolve as a founder.</p>
            <p>• The mother of all tricks: do not start negotiations until all the ducks are in a row.</p>
            <p>• The nuclear option: can you build without this IP?</p>
          </div>
        ]
      }
    );
  }

  return steps;
};
