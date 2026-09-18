export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          full_name: string | null;
          email: string | null;
          profile_image_url: string | null;
          phone: string | null;
          location: string | null;
          professional_title: string | null;
          target_role: string | null;
          experience_level: 'student' | 'intern' | 'entry_level' | 'mid_level' | 'senior_level' | 'executive' | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          full_name?: string | null;
          email?: string | null;
          profile_image_url?: string | null;
          phone?: string | null;
          location?: string | null;
          professional_title?: string | null;
          target_role?: string | null;
          experience_level?: 'student' | 'intern' | 'entry_level' | 'mid_level' | 'senior_level' | 'executive' | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          full_name?: string | null;
          email?: string | null;
          profile_image_url?: string | null;
          phone?: string | null;
          location?: string | null;
          professional_title?: string | null;
          target_role?: string | null;
          experience_level?: 'student' | 'intern' | 'entry_level' | 'mid_level' | 'senior_level' | 'executive' | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          template_id: string | null;
          status: 'draft' | 'completed' | 'archived';
          ats_score: number | null;
          completion_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          template_id?: string | null;
          status?: 'draft' | 'completed' | 'archived';
          ats_score?: number | null;
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          template_id?: string | null;
          status?: 'draft' | 'completed' | 'archived';
          ats_score?: number | null;
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      resume_sections: {
        Row: {
          id: string;
          resume_id: string;
          section_type: string;
          section_order: number;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          section_type: string;
          section_order?: number;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          section_type?: string;
          section_order?: number;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      resume_versions: {
        Row: {
          id: string;
          resume_id: string;
          version_number: number;
          snapshot: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          version_number: number;
          snapshot: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          version_number?: number;
          snapshot?: Json;
          created_at?: string;
        };
      };
      resume_templates: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          preview_image_url: string;
          template_type: 'minimal' | 'modern' | 'professional' | 'ats_friendly';
          is_ats_friendly: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          preview_image_url: string;
          template_type: 'minimal' | 'modern' | 'professional' | 'ats_friendly';
          is_ats_friendly?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          preview_image_url?: string;
          template_type?: 'minimal' | 'modern' | 'professional' | 'ats_friendly';
          is_ats_friendly?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_descriptions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          company: string;
          description: string;
          source_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          company: string;
          description: string;
          source_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          company?: string;
          description?: string;
          source_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ats_analyses: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          job_description_id: string;
          overall_score: number;
          keyword_score: number;
          skills_score: number;
          formatting_score: number;
          experience_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          job_description_id: string;
          overall_score: number;
          keyword_score: number;
          skills_score: number;
          formatting_score: number;
          experience_score: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string;
          job_description_id?: string;
          overall_score?: number;
          keyword_score?: number;
          skills_score?: number;
          formatting_score?: number;
          experience_score?: number;
          created_at?: string;
        };
      };
      ats_keywords: {
        Row: {
          id: string;
          analysis_id: string;
          keyword: string;
          keyword_type: 'matched' | 'missing' | 'recommended';
          importance: 'low' | 'medium' | 'high';
          is_matched: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          keyword: string;
          keyword_type: 'matched' | 'missing' | 'recommended';
          importance: 'low' | 'medium' | 'high';
          is_matched?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          analysis_id?: string;
          keyword?: string;
          keyword_type?: 'matched' | 'missing' | 'recommended';
          importance?: 'low' | 'medium' | 'high';
          is_matched?: boolean;
          created_at?: string;
        };
      };
      ai_recommendations: {
        Row: {
          id: string;
          analysis_id: string;
          category: 'keywords' | 'skills' | 'experience' | 'formatting' | 'summary';
          title: string;
          description: string;
          priority: 'low' | 'medium' | 'high';
          is_resolved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          category: 'keywords' | 'skills' | 'experience' | 'formatting' | 'summary';
          title: string;
          description: string;
          priority: 'low' | 'medium' | 'high';
          is_resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          analysis_id?: string;
          category?: 'keywords' | 'skills' | 'experience' | 'formatting' | 'summary';
          title?: string;
          description?: string;
          priority?: 'low' | 'medium' | 'high';
          is_resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_resume_suggestions: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          resume_section_id: string | null;
          action_type: 'improve_summary' | 'rewrite_experience' | 'improve_project' | 'generate_skills' | 'improve_achievement';
          original_content: string | null;
          suggested_content: string;
          status: 'generated' | 'accepted' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          resume_section_id?: string | null;
          action_type: 'improve_summary' | 'rewrite_experience' | 'improve_project' | 'generate_skills' | 'improve_achievement';
          original_content?: string | null;
          suggested_content: string;
          status?: 'generated' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string;
          resume_section_id?: string | null;
          action_type?: 'improve_summary' | 'rewrite_experience' | 'improve_project' | 'generate_skills' | 'improve_achievement';
          original_content?: string | null;
          suggested_content?: string;
          status?: 'generated' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      mock_interviews: {
        Row: {
          id: string;
          user_id: string;
          target_role: string;
          interview_type: 'technical' | 'behavioral' | 'hr';
          difficulty: 'easy' | 'medium' | 'hard';
          status: 'setup' | 'in_progress' | 'completed' | 'cancelled';
          overall_score: number | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_role: string;
          interview_type: 'technical' | 'behavioral' | 'hr';
          difficulty: 'easy' | 'medium' | 'hard';
          status?: 'setup' | 'in_progress' | 'completed' | 'cancelled';
          overall_score?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_role?: string;
          interview_type?: 'technical' | 'behavioral' | 'hr';
          difficulty?: 'easy' | 'medium' | 'hard';
          status?: 'setup' | 'in_progress' | 'completed' | 'cancelled';
          overall_score?: number | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      interview_questions: {
        Row: {
          id: string;
          interview_id: string;
          question: string;
          question_order: number;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          interview_id: string;
          question: string;
          question_order?: number;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          interview_id?: string;
          question?: string;
          question_order?: number;
          category?: string | null;
          created_at?: string;
        };
      };
      interview_answers: {
        Row: {
          id: string;
          question_id: string;
          answer_text: string | null;
          audio_url: string | null;
          video_url: string | null;
          transcription: string | null;
          technical_score: number | null;
          communication_score: number | null;
          confidence_score: number | null;
          relevance_score: number | null;
          overall_score: number | null;
          ai_feedback: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          answer_text?: string | null;
          audio_url?: string | null;
          video_url?: string | null;
          transcription?: string | null;
          technical_score?: number | null;
          communication_score?: number | null;
          confidence_score?: number | null;
          relevance_score?: number | null;
          overall_score?: number | null;
          ai_feedback?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          answer_text?: string | null;
          audio_url?: string | null;
          video_url?: string | null;
          transcription?: string | null;
          technical_score?: number | null;
          communication_score?: number | null;
          confidence_score?: number | null;
          relevance_score?: number | null;
          overall_score?: number | null;
          ai_feedback?: Json;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan_id: 'free' | 'pro' | 'enterprise';
          status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_id?: 'free' | 'pro' | 'enterprise';
          status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_id?: 'free' | 'pro' | 'enterprise';
          status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_usage: {
        Row: {
          id: string;
          user_id: string;
          ats_scans_count: number;
          ai_generations_count: number;
          mock_interviews_count: number;
          reset_date: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ats_scans_count?: number;
          ai_generations_count?: number;
          mock_interviews_count?: number;
          reset_date?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ats_scans_count?: number;
          ai_generations_count?: number;
          mock_interviews_count?: number;
          reset_date?: string;
          updated_at?: string;
        };
      };
    };
  };
}
