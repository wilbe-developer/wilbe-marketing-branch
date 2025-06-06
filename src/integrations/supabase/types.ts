export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_settings: {
        Row: {
          id: number
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: number
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          id?: number
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      bsf_faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          order_index: number
          question: string
          related_task_id: string | null
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          id?: string
          order_index?: number
          question: string
          related_task_id?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          order_index?: number
          question?: string
          related_task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bsf_faqs_related_task_id_fkey"
            columns: ["related_task_id"]
            isOneToOne: false
            referencedRelation: "sprint_task_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_votes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          vote_type: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          vote_type: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "thread_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_threads: {
        Row: {
          author_id: string
          challenge_id: string | null
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          is_private: boolean
          last_edited_at: string | null
          pinned_at: string | null
          pinned_by: string | null
          recipient_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          challenge_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          is_private?: boolean
          last_edited_at?: string | null
          pinned_at?: string | null
          pinned_by?: string | null
          recipient_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          challenge_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          is_private?: boolean
          last_edited_at?: string | null
          pinned_at?: string | null
          pinned_by?: string | null
          recipient_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_threads_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "sprint_task_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_domains: {
        Row: {
          created_at: string | null
          domain: string
          good_pattern: string | null
          is_catchall: boolean | null
          last_failed_at: string | null
          last_verified_at: string | null
          next_probe_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          good_pattern?: string | null
          is_catchall?: boolean | null
          last_failed_at?: string | null
          last_verified_at?: string | null
          next_probe_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          good_pattern?: string | null
          is_catchall?: boolean | null
          last_failed_at?: string | null
          last_verified_at?: string | null
          next_probe_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      issue_report_attachments: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          report_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          report_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_report_attachments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "issue_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_reports: {
        Row: {
          admin_notes: string | null
          category: string | null
          contact_email: string
          created_at: string
          id: string
          issue_description: string
          priority: string | null
          status: string
          submitted_by_user_id: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          category?: string | null
          contact_email: string
          created_at?: string
          id?: string
          issue_description: string
          priority?: string | null
          status?: string
          submitted_by_user_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          category?: string | null
          contact_email?: string
          created_at?: string
          id?: string
          issue_description?: string
          priority?: string | null
          status?: string
          submitted_by_user_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      merch_orders: {
        Row: {
          address: string
          city: string
          country: string
          country_code: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string
          postal: string
          product_name: string
          product_size: string
        }
        Insert: {
          address: string
          city: string
          country: string
          country_code: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone: string
          postal: string
          product_name: string
          product_size: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          country_code?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string
          postal?: string
          product_name?: string
          product_size?: string
        }
        Relationships: []
      }
      metrics: {
        Row: {
          created_at: string | null
          domain: string | null
          error_message: string | null
          error_reason: string | null
          event_type: string
          id: string
          is_catchall: boolean | null
          latency_ms: number | null
          mx_found: boolean
          pattern_tried: string | null
          smtp_success: boolean | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          error_message?: string | null
          error_reason?: string | null
          event_type: string
          id?: string
          is_catchall?: boolean | null
          latency_ms?: number | null
          mx_found?: boolean
          pattern_tried?: string | null
          smtp_success?: boolean | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          error_message?: string | null
          error_reason?: string | null
          event_type?: string
          id?: string
          is_catchall?: boolean | null
          latency_ms?: number | null
          mx_found?: boolean
          pattern_tried?: string | null
          smtp_success?: boolean | null
        }
        Relationships: []
      }
      module_videos: {
        Row: {
          id: string
          module_id: string
          module_name: string | null
          order_index: number | null
          video_id: string
        }
        Insert: {
          id?: string
          module_id: string
          module_name?: string | null
          order_index?: number | null
          video_id: string
        }
        Update: {
          id?: string
          module_id?: string
          module_name?: string | null
          order_index?: number | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_videos_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_deck_builder_module: boolean | null
          order_index: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_deck_builder_module?: boolean | null
          order_index?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_deck_builder_module?: boolean | null
          order_index?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about: string | null
          activity_status: string | null
          application_status: string | null
          application_submitted_at: string | null
          approved: boolean | null
          avatar: string | null
          bio: string | null
          cover_photo: string | null
          created_at: string | null
          email: string | null
          expertise: string | null
          first_name: string | null
          id: string
          institution: string | null
          last_login_date: string | null
          last_name: string | null
          linked_in: string | null
          location: string | null
          role: string | null
          status: string | null
          twitter_handle: string | null
          wix_creation_date: string | null
          wix_id: string | null
          wix_last_login: string | null
          wix_last_updated: string | null
        }
        Insert: {
          about?: string | null
          activity_status?: string | null
          application_status?: string | null
          application_submitted_at?: string | null
          approved?: boolean | null
          avatar?: string | null
          bio?: string | null
          cover_photo?: string | null
          created_at?: string | null
          email?: string | null
          expertise?: string | null
          first_name?: string | null
          id: string
          institution?: string | null
          last_login_date?: string | null
          last_name?: string | null
          linked_in?: string | null
          location?: string | null
          role?: string | null
          status?: string | null
          twitter_handle?: string | null
          wix_creation_date?: string | null
          wix_id?: string | null
          wix_last_login?: string | null
          wix_last_updated?: string | null
        }
        Update: {
          about?: string | null
          activity_status?: string | null
          application_status?: string | null
          application_submitted_at?: string | null
          approved?: boolean | null
          avatar?: string | null
          bio?: string | null
          cover_photo?: string | null
          created_at?: string | null
          email?: string | null
          expertise?: string | null
          first_name?: string | null
          id?: string
          institution?: string | null
          last_login_date?: string | null
          last_name?: string | null
          linked_in?: string | null
          location?: string | null
          role?: string | null
          status?: string | null
          twitter_handle?: string | null
          wix_creation_date?: string | null
          wix_id?: string | null
          wix_last_login?: string | null
          wix_last_updated?: string | null
        }
        Relationships: []
      }
      quiz_visits: {
        Row: {
          created_at: string
          id: string
          session_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      sprint_collaborators: {
        Row: {
          access_level: string
          collaborator_id: string
          created_at: string
          created_by: string
          id: string
          sprint_owner_id: string
        }
        Insert: {
          access_level?: string
          collaborator_id: string
          created_at?: string
          created_by: string
          id?: string
          sprint_owner_id: string
        }
        Update: {
          access_level?: string
          collaborator_id?: string
          created_at?: string
          created_by?: string
          id?: string
          sprint_owner_id?: string
        }
        Relationships: []
      }
      sprint_profiles: {
        Row: {
          ambitious_version: string | null
          commercializing_invention: boolean | null
          company_incorporated: boolean | null
          competition_research: boolean | null
          created_at: string
          current_job: string | null
          customer_engagement: string | null
          customer_evidence: boolean | null
          cv_url: string | null
          dashboard_access_enabled: boolean | null
          data_room_public: boolean
          deck_feedback: boolean | null
          email: string | null
          experiment_validated: boolean | null
          funding_amount: string | null
          funding_details: string | null
          funding_sources: string[] | null
          has_deck: boolean | null
          has_financial_plan: boolean | null
          id: string
          impact_scale: string[] | null
          industry_changing_vision: boolean | null
          ip_concerns: boolean | null
          is_scientist_engineer: boolean | null
          job_type: string | null
          lab_space_details: string | null
          lab_space_needed: boolean | null
          lab_space_secured: boolean | null
          linkedin_url: string | null
          market_gap_reason: string | null
          market_known: boolean | null
          minimal_success_version: string | null
          name: string | null
          planned_accelerators: boolean | null
          planned_accelerators_details: string | null
          potential_beneficiaries: boolean | null
          prior_accelerators: boolean | null
          prior_accelerators_details: string | null
          problem_defined: boolean | null
          received_funding: boolean | null
          specific_customers: boolean | null
          sprint_start_date: string | null
          success_vision_10yr: boolean | null
          success_vision_1yr: boolean | null
          team_status: string | null
          tto_engaged: boolean | null
          university_ip: boolean | null
          updated_at: string
          user_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          ambitious_version?: string | null
          commercializing_invention?: boolean | null
          company_incorporated?: boolean | null
          competition_research?: boolean | null
          created_at?: string
          current_job?: string | null
          customer_engagement?: string | null
          customer_evidence?: boolean | null
          cv_url?: string | null
          dashboard_access_enabled?: boolean | null
          data_room_public?: boolean
          deck_feedback?: boolean | null
          email?: string | null
          experiment_validated?: boolean | null
          funding_amount?: string | null
          funding_details?: string | null
          funding_sources?: string[] | null
          has_deck?: boolean | null
          has_financial_plan?: boolean | null
          id?: string
          impact_scale?: string[] | null
          industry_changing_vision?: boolean | null
          ip_concerns?: boolean | null
          is_scientist_engineer?: boolean | null
          job_type?: string | null
          lab_space_details?: string | null
          lab_space_needed?: boolean | null
          lab_space_secured?: boolean | null
          linkedin_url?: string | null
          market_gap_reason?: string | null
          market_known?: boolean | null
          minimal_success_version?: string | null
          name?: string | null
          planned_accelerators?: boolean | null
          planned_accelerators_details?: string | null
          potential_beneficiaries?: boolean | null
          prior_accelerators?: boolean | null
          prior_accelerators_details?: string | null
          problem_defined?: boolean | null
          received_funding?: boolean | null
          specific_customers?: boolean | null
          sprint_start_date?: string | null
          success_vision_10yr?: boolean | null
          success_vision_1yr?: boolean | null
          team_status?: string | null
          tto_engaged?: boolean | null
          university_ip?: boolean | null
          updated_at?: string
          user_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          ambitious_version?: string | null
          commercializing_invention?: boolean | null
          company_incorporated?: boolean | null
          competition_research?: boolean | null
          created_at?: string
          current_job?: string | null
          customer_engagement?: string | null
          customer_evidence?: boolean | null
          cv_url?: string | null
          dashboard_access_enabled?: boolean | null
          data_room_public?: boolean
          deck_feedback?: boolean | null
          email?: string | null
          experiment_validated?: boolean | null
          funding_amount?: string | null
          funding_details?: string | null
          funding_sources?: string[] | null
          has_deck?: boolean | null
          has_financial_plan?: boolean | null
          id?: string
          impact_scale?: string[] | null
          industry_changing_vision?: boolean | null
          ip_concerns?: boolean | null
          is_scientist_engineer?: boolean | null
          job_type?: string | null
          lab_space_details?: string | null
          lab_space_needed?: boolean | null
          lab_space_secured?: boolean | null
          linkedin_url?: string | null
          market_gap_reason?: string | null
          market_known?: boolean | null
          minimal_success_version?: string | null
          name?: string | null
          planned_accelerators?: boolean | null
          planned_accelerators_details?: string | null
          potential_beneficiaries?: boolean | null
          prior_accelerators?: boolean | null
          prior_accelerators_details?: string | null
          problem_defined?: boolean | null
          received_funding?: boolean | null
          specific_customers?: boolean | null
          sprint_start_date?: string | null
          success_vision_10yr?: boolean | null
          success_vision_1yr?: boolean | null
          team_status?: string | null
          tto_engaged?: boolean | null
          university_ip?: boolean | null
          updated_at?: string
          user_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      sprint_task_definitions: {
        Row: {
          created_at: string | null
          definition: Json
          description: string | null
          id: string
          name: string
          updated_at: string | null
          workload: string | null
        }
        Insert: {
          created_at?: string | null
          definition: Json
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          workload?: string | null
        }
        Update: {
          created_at?: string | null
          definition?: Json
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          workload?: string | null
        }
        Relationships: []
      }
      sprint_tasks: {
        Row: {
          category: string | null
          content: string | null
          description: string | null
          id: string
          options: Json | null
          order_index: number
          question: string | null
          required_upload: boolean | null
          status: string | null
          title: string
          upload_required: boolean
        }
        Insert: {
          category?: string | null
          content?: string | null
          description?: string | null
          id?: string
          options?: Json | null
          order_index: number
          question?: string | null
          required_upload?: boolean | null
          status?: string | null
          title: string
          upload_required?: boolean
        }
        Update: {
          category?: string | null
          content?: string | null
          description?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          question?: string | null
          required_upload?: boolean | null
          status?: string | null
          title?: string
          upload_required?: boolean
        }
        Relationships: []
      }
      task_definitions: {
        Row: {
          answer_mapping: Json | null
          category: string | null
          conditional_flow: Json | null
          created_at: string
          description: string | null
          id: string
          profile_key: string | null
          profile_label: string | null
          profile_options: Json | null
          profile_type: string | null
          steps: Json
          title: string
          updated_at: string
        }
        Insert: {
          answer_mapping?: Json | null
          category?: string | null
          conditional_flow?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          profile_key?: string | null
          profile_label?: string | null
          profile_options?: Json | null
          profile_type?: string | null
          steps: Json
          title: string
          updated_at?: string
        }
        Update: {
          answer_mapping?: Json | null
          category?: string | null
          conditional_flow?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          profile_key?: string | null
          profile_label?: string | null
          profile_options?: Json | null
          profile_type?: string | null
          steps?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          employment_status: string
          id: string
          name: string
          owner_id: string
          profile_description: string
          relationship_description: string | null
          trigger_points: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          employment_status: string
          id?: string
          name: string
          owner_id: string
          profile_description: string
          relationship_description?: string | null
          trigger_points?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          employment_status?: string
          id?: string
          name?: string
          owner_id?: string
          profile_description?: string
          relationship_description?: string | null
          trigger_points?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      thread_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          thread_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          thread_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "discussion_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_views: {
        Row: {
          last_viewed_at: string
          thread_id: string
          user_id: string
        }
        Insert: {
          last_viewed_at?: string
          thread_id: string
          user_id: string
        }
        Update: {
          last_viewed_at?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_views_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "discussion_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_votes: {
        Row: {
          created_at: string
          id: string
          thread_id: string
          updated_at: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          thread_id: string
          updated_at?: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          thread_id?: string
          updated_at?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_votes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "discussion_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          is_default: boolean
          name: string
          openalex_ror: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_default?: boolean
          name: string
          openalex_ror?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_default?: boolean
          name?: string
          openalex_ror?: string | null
        }
        Relationships: []
      }
      user_applications: {
        Row: {
          application_type: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_type?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_type?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_files: {
        Row: {
          download_url: string
          drive_file_id: string
          file_name: string
          id: string
          uploaded_at: string
          user_id: string
          view_url: string
        }
        Insert: {
          download_url: string
          drive_file_id: string
          file_name: string
          id?: string
          uploaded_at?: string
          user_id: string
          view_url: string
        }
        Update: {
          download_url?: string
          drive_file_id?: string
          file_name?: string
          id?: string
          uploaded_at?: string
          user_id?: string
          view_url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles_profile_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_roles_profile_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "unified_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_sprint_progress: {
        Row: {
          answers: Json | null
          completed: boolean
          completed_at: string | null
          created_at: string
          file_id: string | null
          id: string
          profile_updates: Json | null
          task_answers: Json | null
          task_id: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          file_id?: string | null
          id?: string
          profile_updates?: Json | null
          task_answers?: Json | null
          task_id: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          file_id?: string | null
          id?: string
          profile_updates?: Json | null
          task_answers?: Json | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sprint_progress_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "user_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sprint_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "sprint_task_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_task_progress: {
        Row: {
          answers: Json | null
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          profile_updates: Json | null
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          profile_updates?: Json | null
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          profile_updates?: Json | null
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_task_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "sprint_task_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      video_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          last_watched_at: string | null
          progress_percentage: number | null
          updated_at: string | null
          user_id: string
          video_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_watched_at?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id: string
          video_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_watched_at?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          content_id: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          featured: boolean | null
          id: string
          length: string | null
          length_numeric: number | null
          presenter: string | null
          publish_date: string | null
          quiz: Json | null
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          unpublish_date: string | null
          updated_at: string | null
          youtube_id: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          length?: string | null
          length_numeric?: number | null
          presenter?: string | null
          publish_date?: string | null
          quiz?: Json | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          unpublish_date?: string | null
          updated_at?: string | null
          youtube_id?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          length?: string | null
          length_numeric?: number | null
          presenter?: string | null
          publish_date?: string | null
          quiz?: Json | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          unpublish_date?: string | null
          updated_at?: string | null
          youtube_id?: string | null
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          referral_code: string
          referrer_id: string | null
          successful_referrals: number | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          referral_code: string
          referrer_id?: string | null
          successful_referrals?: number | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          referral_code?: string
          referrer_id?: string | null
          successful_referrals?: number | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_signups_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "waitlist_signups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      unified_profiles: {
        Row: {
          about: string | null
          activity_status: string | null
          approved: boolean | null
          avatar: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          expertise: string | null
          first_name: string | null
          has_profile: boolean | null
          has_sprint_profile: boolean | null
          institution: string | null
          last_login_date: string | null
          last_name: string | null
          linked_in: string | null
          location: string | null
          role: string | null
          status: string | null
          twitter_handle: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_thread_score: {
        Args: { p_thread_id: string; p_sort_type?: string }
        Returns: number
      }
      can_access_data_room: {
        Args: { p_sprint_owner_id: string; p_requesting_user_id?: string }
        Returns: boolean
      }
      create_sprint_profile: {
        Args:
          | {
              p_user_id: string
              p_name: string
              p_email: string
              p_linkedin_url: string
              p_cv_url: string
              p_current_job: string
              p_company_incorporated: boolean
              p_received_funding: boolean
              p_funding_details: string
              p_has_deck: boolean
              p_team_status: string
              p_commercializing_invention: boolean
              p_university_ip: boolean
              p_tto_engaged: boolean
              p_problem_defined: boolean
              p_customer_engagement: string
              p_market_known: boolean
              p_market_gap_reason: string
              p_funding_amount: string
              p_has_financial_plan: boolean
              p_funding_sources: string[]
              p_experiment_validated: boolean
              p_industry_changing_vision: boolean
            }
          | {
              p_user_id: string
              p_name: string
              p_email: string
              p_linkedin_url: string
              p_cv_url: string
              p_current_job: string
              p_company_incorporated: boolean
              p_received_funding: boolean
              p_funding_details: string
              p_has_deck: boolean
              p_team_status: string
              p_commercializing_invention: boolean
              p_university_ip: boolean
              p_tto_engaged: boolean
              p_problem_defined: boolean
              p_customer_engagement: string
              p_market_known: boolean
              p_market_gap_reason: string
              p_funding_amount: string
              p_has_financial_plan: boolean
              p_funding_sources: string[]
              p_experiment_validated: boolean
              p_industry_changing_vision: boolean
              p_is_scientist_engineer: boolean
              p_job_type: string
              p_ip_concerns: boolean
              p_potential_beneficiaries: boolean
              p_specific_customers: boolean
              p_customer_evidence: boolean
              p_competition_research: boolean
              p_success_vision_1yr: boolean
              p_success_vision_10yr: boolean
              p_impact_scale: string[]
              p_prior_accelerators: boolean
              p_prior_accelerators_details: string
              p_planned_accelerators: boolean
              p_planned_accelerators_details: string
              p_lab_space_needed: boolean
              p_lab_space_secured: boolean
              p_lab_space_details: string
              p_deck_feedback: boolean
            }
          | {
              p_user_id: string
              p_name: string
              p_email: string
              p_linkedin_url: string
              p_cv_url: string
              p_current_job: string
              p_company_incorporated: boolean
              p_received_funding: boolean
              p_funding_details: string
              p_has_deck: boolean
              p_team_status: string
              p_commercializing_invention: boolean
              p_university_ip: boolean
              p_tto_engaged: boolean
              p_problem_defined: boolean
              p_customer_engagement: string
              p_market_known: boolean
              p_market_gap_reason: string
              p_funding_amount: string
              p_has_financial_plan: boolean
              p_funding_sources: string[]
              p_experiment_validated: boolean
              p_industry_changing_vision: boolean
              p_is_scientist_engineer: boolean
              p_job_type: string
              p_ip_concerns: boolean
              p_potential_beneficiaries: boolean
              p_specific_customers: boolean
              p_customer_evidence: boolean
              p_competition_research: boolean
              p_success_vision_1yr: boolean
              p_success_vision_10yr: boolean
              p_impact_scale: string[]
              p_prior_accelerators: boolean
              p_prior_accelerators_details: string
              p_planned_accelerators: boolean
              p_planned_accelerators_details: string
              p_lab_space_needed: boolean
              p_lab_space_secured: boolean
              p_lab_space_details: string
              p_deck_feedback: boolean
              p_utm_source: string
              p_utm_medium: string
              p_utm_campaign: string
              p_utm_term: string
              p_utm_content: string
            }
          | {
              p_user_id: string
              p_name: string
              p_email: string
              p_linkedin_url: string
              p_cv_url: string
              p_current_job: string
              p_company_incorporated: boolean
              p_received_funding: boolean
              p_funding_details: string
              p_has_deck: boolean
              p_team_status: string
              p_commercializing_invention: boolean
              p_university_ip: boolean
              p_tto_engaged: boolean
              p_problem_defined: boolean
              p_customer_engagement: string
              p_market_known: boolean
              p_market_gap_reason: string
              p_funding_amount: string
              p_has_financial_plan: boolean
              p_funding_sources: string[]
              p_experiment_validated: boolean
              p_industry_changing_vision: boolean
              p_is_scientist_engineer: boolean
              p_job_type: string
              p_ip_concerns: boolean
              p_potential_beneficiaries: boolean
              p_specific_customers: boolean
              p_customer_evidence: boolean
              p_competition_research: boolean
              p_success_vision_1yr: boolean
              p_success_vision_10yr: boolean
              p_impact_scale: string[]
              p_prior_accelerators: boolean
              p_prior_accelerators_details: string
              p_planned_accelerators: boolean
              p_planned_accelerators_details: string
              p_lab_space_needed: boolean
              p_lab_space_secured: boolean
              p_lab_space_details: string
              p_deck_feedback: boolean
              p_utm_source: string
              p_utm_medium: string
              p_utm_campaign: string
              p_utm_term: string
              p_utm_content: string
              p_minimal_success_version: string
            }
          | {
              p_user_id: string
              p_name: string
              p_email: string
              p_linkedin_url: string
              p_cv_url: string
              p_current_job: string
              p_company_incorporated: boolean
              p_received_funding: boolean
              p_funding_details: string
              p_has_deck: boolean
              p_team_status: string
              p_commercializing_invention: boolean
              p_university_ip: boolean
              p_tto_engaged: boolean
              p_problem_defined: boolean
              p_customer_engagement: string
              p_market_known: boolean
              p_market_gap_reason: string
              p_funding_amount: string
              p_has_financial_plan: boolean
              p_funding_sources: string[]
              p_experiment_validated: boolean
              p_industry_changing_vision: boolean
              p_is_scientist_engineer: boolean
              p_job_type: string
              p_ip_concerns: boolean
              p_potential_beneficiaries: boolean
              p_specific_customers: boolean
              p_customer_evidence: boolean
              p_competition_research: boolean
              p_success_vision_1yr: boolean
              p_success_vision_10yr: boolean
              p_impact_scale: string[]
              p_prior_accelerators: boolean
              p_prior_accelerators_details: string
              p_planned_accelerators: boolean
              p_planned_accelerators_details: string
              p_lab_space_needed: boolean
              p_lab_space_secured: boolean
              p_lab_space_details: string
              p_deck_feedback: boolean
              p_utm_source: string
              p_utm_medium: string
              p_utm_campaign: string
              p_utm_term: string
              p_utm_content: string
              p_minimal_success_version: string
              p_dashboard_access_enabled?: boolean
            }
          | {
              p_user_id: string
              p_name: string
              p_email: string
              p_linkedin_url: string
              p_cv_url: string
              p_current_job: string
              p_company_incorporated: boolean
              p_received_funding: boolean
              p_funding_details: string
              p_has_deck: boolean
              p_team_status: string
              p_commercializing_invention: boolean
              p_university_ip: boolean
              p_tto_engaged: boolean
              p_problem_defined: boolean
              p_customer_engagement: string
              p_market_known: boolean
              p_market_gap_reason: string
              p_funding_amount: string
              p_has_financial_plan: boolean
              p_funding_sources: string[]
              p_experiment_validated: boolean
              p_industry_changing_vision: boolean
              p_is_scientist_engineer: boolean
              p_job_type: string
              p_ip_concerns: boolean
              p_potential_beneficiaries: boolean
              p_specific_customers: boolean
              p_customer_evidence: boolean
              p_competition_research: boolean
              p_success_vision_1yr: boolean
              p_success_vision_10yr: boolean
              p_impact_scale: string[]
              p_prior_accelerators: boolean
              p_prior_accelerators_details: string
              p_planned_accelerators: boolean
              p_planned_accelerators_details: string
              p_lab_space_needed: boolean
              p_lab_space_secured: boolean
              p_lab_space_details: string
              p_deck_feedback: boolean
              p_utm_source: string
              p_utm_medium: string
              p_utm_campaign: string
              p_utm_term: string
              p_utm_content: string
              p_minimal_success_version: string
              p_dashboard_access_enabled?: boolean
              p_ambitious_version?: string
            }
          | {
              p_user_id: string
              p_name: string
              p_email: string
              p_linkedin_url: string
              p_cv_url: string
              p_current_job: string
              p_company_incorporated: boolean
              p_received_funding: boolean
              p_funding_details: string
              p_has_deck: boolean
              p_team_status: string
              p_commercializing_invention: boolean
              p_university_ip: boolean
              p_tto_engaged: boolean
              p_problem_defined: boolean
              p_customer_engagement: string
              p_market_known: boolean
              p_market_gap_reason: string
              p_funding_amount: string
              p_has_financial_plan: boolean
              p_funding_sources: string[]
              p_experiment_validated: boolean
              p_industry_changing_vision: boolean
              p_is_scientist_engineer: boolean
              p_job_type: string
              p_ip_concerns: boolean
              p_potential_beneficiaries: boolean
              p_specific_customers: boolean
              p_customer_evidence: boolean
              p_competition_research: boolean
              p_success_vision_1yr: boolean
              p_success_vision_10yr: boolean
              p_impact_scale: string[]
              p_prior_accelerators: boolean
              p_prior_accelerators_details: string
              p_planned_accelerators: boolean
              p_planned_accelerators_details: string
              p_lab_space_needed: boolean
              p_lab_space_secured: boolean
              p_lab_space_details: string
              p_deck_feedback: boolean
              p_utm_source: string
              p_utm_medium: string
              p_utm_campaign: string
              p_utm_term: string
              p_utm_content: string
              p_minimal_success_version: string
              p_dashboard_access_enabled?: boolean
              p_sprint_start_date?: string
            }
        Returns: undefined
      }
      get_all_unified_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          first_name: string
          last_name: string
          email: string
          linked_in: string
          institution: string
          location: string
          role: string
          bio: string
          about: string
          expertise: string
          avatar: string
          approved: boolean
          created_at: string
          activity_status: string
          status: string
          twitter_handle: string
          last_login_date: string
          has_sprint_profile: boolean
          has_profile: boolean
        }[]
      }
      get_application_status: {
        Args: { p_user_id: string; p_application_type?: string }
        Returns: Database["public"]["Enums"]["application_status"]
      }
      get_comment_vote_summary: {
        Args: { p_comment_id: string }
        Returns: {
          upvotes: number
          downvotes: number
          net_votes: number
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_member_directory_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          first_name: string
          last_name: string
          email: string
          linked_in: string
          institution: string
          location: string
          role: string
          bio: string
          about: string
          expertise: string
          avatar: string
          approved: boolean
          created_at: string
          activity_status: string
          status: string
          twitter_handle: string
          last_login_date: string
          has_sprint_profile: boolean
          has_profile: boolean
        }[]
      }
      get_sorted_community_threads: {
        Args: {
          p_sort_type?: string
          p_challenge_id?: string
          p_is_private?: boolean
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          title: string
          content: string
          author_id: string
          challenge_id: string
          is_private: boolean
          recipient_id: string
          created_at: string
          last_edited_at: string
          is_pinned: boolean
          pinned_at: string
          pinned_by: string
          score: number
        }[]
      }
      get_sorted_thread_comments: {
        Args: { p_thread_id: string; p_sort_type?: string }
        Returns: {
          id: string
          thread_id: string
          author_id: string
          content: string
          created_at: string
          updated_at: string
          upvotes: number
          downvotes: number
          score: number
        }[]
      }
      get_thread_vote_summary: {
        Args: { p_thread_id: string }
        Returns: {
          upvotes: number
          downvotes: number
          net_votes: number
        }[]
      }
      get_unified_profile: {
        Args: { p_user_id: string }
        Returns: {
          user_id: string
          first_name: string
          last_name: string
          email: string
          linked_in: string
          institution: string
          location: string
          role: string
          bio: string
          about: string
          expertise: string
          avatar: string
          approved: boolean
          created_at: string
          activity_status: string
          status: string
          twitter_handle: string
          last_login_date: string
          has_sprint_profile: boolean
          has_profile: boolean
        }[]
      }
      has_completed_sprint_onboarding: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      increment_referral_count: {
        Args: { p_referrer_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_member: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_sprint_collaborator: {
        Args: { p_user_id: string; p_owner_id: string }
        Returns: boolean
      }
      is_sprint_manager: {
        Args: { p_user_id: string; p_sprint_owner_id: string }
        Returns: boolean
      }
      submit_membership_application: {
        Args: {
          p_user_id: string
          p_first_name: string
          p_last_name: string
          p_institution: string
          p_linkedin: string
        }
        Returns: undefined
      }
    }
    Enums: {
      application_status: "not_started" | "under_review"
      user_role: "admin" | "user" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["not_started", "under_review"],
      user_role: ["admin", "user", "member"],
    },
  },
} as const
