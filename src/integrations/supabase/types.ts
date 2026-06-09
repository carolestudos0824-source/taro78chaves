export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_email: string | null
          admin_id: string
          created_at: string
          details: Json
          id: string
          target_id: string | null
          target_label: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_email?: string | null
          admin_id: string
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_label?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_email?: string | null
          admin_id?: string
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_label?: string | null
          target_type?: string
        }
        Relationships: []
      }
      beta_feedback: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string | null
          id: string
          message: string
          name: string | null
          page: string | null
          rating: number | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["feedback_status"]
          subject: string | null
          type: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name?: string | null
          page?: string | null
          rating?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          subject?: string | null
          type: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string | null
          page?: string | null
          rating?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          subject?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_url: string | null
          completion_percentage: number | null
          course_name: string | null
          created_at: string
          id: string
          issued_at: string | null
          status: string | null
          student_name: string
          updated_at: string
          user_id: string
          validation_code: string
          workload_hours: number | null
        }
        Insert: {
          certificate_url?: string | null
          completion_percentage?: number | null
          course_name?: string | null
          created_at?: string
          id?: string
          issued_at?: string | null
          status?: string | null
          student_name: string
          updated_at?: string
          user_id: string
          validation_code: string
          workload_hours?: number | null
        }
        Update: {
          certificate_url?: string | null
          completion_percentage?: number | null
          course_name?: string | null
          created_at?: string
          id?: string
          issued_at?: string | null
          status?: string | null
          student_name?: string
          updated_at?: string
          user_id?: string
          validation_code?: string
          workload_hours?: number | null
        }
        Relationships: []
      }
      cms_arcanos: {
        Row: {
          amor: string | null
          aprofundamento: string | null
          arquetipos: string | null
          astrologia: string | null
          cabala: string | null
          citacao: string | null
          created_at: string
          created_by: string | null
          elemento: string | null
          espiritualidade: string | null
          essencia: string | null
          id: string
          image_url: string | null
          jornada: string | null
          keywords: string[]
          luz: string | null
          naipe: Database["public"]["Enums"]["arcano_naipe"] | null
          name: string
          number: number
          numeral: string | null
          numerologia: string | null
          pratica: string | null
          quiz_id: string | null
          revisao_rapida: string | null
          simbolos_centrais: string | null
          sombra: string | null
          status: Database["public"]["Enums"]["module_status"]
          subtitle: string | null
          tags: string[]
          tier: Database["public"]["Enums"]["module_tier"]
          trabalho: string | null
          type: Database["public"]["Enums"]["arcano_type"]
          updated_at: string
          validated: boolean
          voz_do_arcano: string | null
        }
        Insert: {
          amor?: string | null
          aprofundamento?: string | null
          arquetipos?: string | null
          astrologia?: string | null
          cabala?: string | null
          citacao?: string | null
          created_at?: string
          created_by?: string | null
          elemento?: string | null
          espiritualidade?: string | null
          essencia?: string | null
          id?: string
          image_url?: string | null
          jornada?: string | null
          keywords?: string[]
          luz?: string | null
          naipe?: Database["public"]["Enums"]["arcano_naipe"] | null
          name: string
          number: number
          numeral?: string | null
          numerologia?: string | null
          pratica?: string | null
          quiz_id?: string | null
          revisao_rapida?: string | null
          simbolos_centrais?: string | null
          sombra?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          subtitle?: string | null
          tags?: string[]
          tier?: Database["public"]["Enums"]["module_tier"]
          trabalho?: string | null
          type: Database["public"]["Enums"]["arcano_type"]
          updated_at?: string
          validated?: boolean
          voz_do_arcano?: string | null
        }
        Update: {
          amor?: string | null
          aprofundamento?: string | null
          arquetipos?: string | null
          astrologia?: string | null
          cabala?: string | null
          citacao?: string | null
          created_at?: string
          created_by?: string | null
          elemento?: string | null
          espiritualidade?: string | null
          essencia?: string | null
          id?: string
          image_url?: string | null
          jornada?: string | null
          keywords?: string[]
          luz?: string | null
          naipe?: Database["public"]["Enums"]["arcano_naipe"] | null
          name?: string
          number?: number
          numeral?: string | null
          numerologia?: string | null
          pratica?: string | null
          quiz_id?: string | null
          revisao_rapida?: string | null
          simbolos_centrais?: string | null
          sombra?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          subtitle?: string | null
          tags?: string[]
          tier?: Database["public"]["Enums"]["module_tier"]
          trabalho?: string | null
          type?: Database["public"]["Enums"]["arcano_type"]
          updated_at?: string
          validated?: boolean
          voz_do_arcano?: string | null
        }
        Relationships: []
      }
      cms_certificates: {
        Row: {
          accent_color: string | null
          completion_check: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          order_index: number
          slug: string
          status: Database["public"]["Enums"]["module_status"]
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          completion_check: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          order_index?: number
          slug: string
          status?: Database["public"]["Enums"]["module_status"]
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          completion_check?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          order_index?: number
          slug?: string
          status?: Database["public"]["Enums"]["module_status"]
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_court_cards: {
        Row: {
          created_at: string
          exemplos_interpretacao: string[]
          explicacao_simbolica: string | null
          id: string
          leitura_pratica: string | null
          leitura_psicologica: string | null
          manifestacao_copas_texto: string | null
          manifestacao_copas_titulo: string | null
          manifestacao_espadas_texto: string | null
          manifestacao_espadas_titulo: string | null
          manifestacao_ouros_texto: string | null
          manifestacao_ouros_titulo: string | null
          manifestacao_paus_texto: string | null
          manifestacao_paus_titulo: string | null
          nome: string
          order_index: number
          palavras_chave: string[]
          principio: string | null
          reflexao: string | null
          simbolo: string | null
          slug: string
          status: Database["public"]["Enums"]["module_status"]
          subtitulo: string | null
          texto_principal: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exemplos_interpretacao?: string[]
          explicacao_simbolica?: string | null
          id?: string
          leitura_pratica?: string | null
          leitura_psicologica?: string | null
          manifestacao_copas_texto?: string | null
          manifestacao_copas_titulo?: string | null
          manifestacao_espadas_texto?: string | null
          manifestacao_espadas_titulo?: string | null
          manifestacao_ouros_texto?: string | null
          manifestacao_ouros_titulo?: string | null
          manifestacao_paus_texto?: string | null
          manifestacao_paus_titulo?: string | null
          nome: string
          order_index?: number
          palavras_chave?: string[]
          principio?: string | null
          reflexao?: string | null
          simbolo?: string | null
          slug: string
          status?: Database["public"]["Enums"]["module_status"]
          subtitulo?: string | null
          texto_principal: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exemplos_interpretacao?: string[]
          explicacao_simbolica?: string | null
          id?: string
          leitura_pratica?: string | null
          leitura_psicologica?: string | null
          manifestacao_copas_texto?: string | null
          manifestacao_copas_titulo?: string | null
          manifestacao_espadas_texto?: string | null
          manifestacao_espadas_titulo?: string | null
          manifestacao_ouros_texto?: string | null
          manifestacao_ouros_titulo?: string | null
          manifestacao_paus_texto?: string | null
          manifestacao_paus_titulo?: string | null
          nome?: string
          order_index?: number
          palavras_chave?: string[]
          principio?: string | null
          reflexao?: string | null
          simbolo?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["module_status"]
          subtitulo?: string | null
          texto_principal?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_journey_arcanos: {
        Row: {
          arcano_number: number
          created_at: string
          id: string
          journey_role: string
          name: string
          narrative_text: string
          numeral: string
          order_index: number
          phase_slug: string
          status: Database["public"]["Enums"]["module_status"]
          updated_at: string
        }
        Insert: {
          arcano_number: number
          created_at?: string
          id?: string
          journey_role: string
          name: string
          narrative_text: string
          numeral: string
          order_index?: number
          phase_slug: string
          status?: Database["public"]["Enums"]["module_status"]
          updated_at?: string
        }
        Update: {
          arcano_number?: number
          created_at?: string
          id?: string
          journey_role?: string
          name?: string
          narrative_text?: string
          numeral?: string
          order_index?: number
          phase_slug?: string
          status?: Database["public"]["Enums"]["module_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_journey_arcanos_phase_slug_fkey"
            columns: ["phase_slug"]
            isOneToOne: false
            referencedRelation: "cms_journey_phases"
            referencedColumns: ["slug"]
          },
        ]
      }
      cms_journey_meta: {
        Row: {
          closing_body: string | null
          closing_invitation: string | null
          closing_title: string
          created_at: string
          id: string
          intro_body: string[]
          intro_epigraph: string | null
          intro_subtitle: string | null
          intro_title: string
          singleton: boolean
          status: Database["public"]["Enums"]["module_status"]
          updated_at: string
        }
        Insert: {
          closing_body?: string | null
          closing_invitation?: string | null
          closing_title: string
          created_at?: string
          id?: string
          intro_body?: string[]
          intro_epigraph?: string | null
          intro_subtitle?: string | null
          intro_title: string
          singleton?: boolean
          status?: Database["public"]["Enums"]["module_status"]
          updated_at?: string
        }
        Update: {
          closing_body?: string | null
          closing_invitation?: string | null
          closing_title?: string
          created_at?: string
          id?: string
          intro_body?: string[]
          intro_epigraph?: string | null
          intro_subtitle?: string | null
          intro_title?: string
          singleton?: boolean
          status?: Database["public"]["Enums"]["module_status"]
          updated_at?: string
        }
        Relationships: []
      }
      cms_journey_phases: {
        Row: {
          arcano_ids: number[]
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          order_index: number
          slug: string
          status: Database["public"]["Enums"]["module_status"]
          subtitle: string | null
          symbol: string | null
          theme: string
          tier: Database["public"]["Enums"]["module_tier"]
          title: string
          updated_at: string
        }
        Insert: {
          arcano_ids?: number[]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          order_index?: number
          slug: string
          status?: Database["public"]["Enums"]["module_status"]
          subtitle?: string | null
          symbol?: string | null
          theme?: string
          tier?: Database["public"]["Enums"]["module_tier"]
          title: string
          updated_at?: string
        }
        Update: {
          arcano_ids?: number[]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          order_index?: number
          slug?: string
          status?: Database["public"]["Enums"]["module_status"]
          subtitle?: string | null
          symbol?: string | null
          theme?: string
          tier?: Database["public"]["Enums"]["module_tier"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_module_lessons: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          module_id: string
          order_index: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          module_id: string
          order_index?: number
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          module_id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_module_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "cms_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_modules: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          editorial_description: string | null
          icon: string | null
          id: string
          name: string
          order_index: number
          route_prefix: string | null
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["module_status"]
          theme_color: string | null
          tier: Database["public"]["Enums"]["module_tier"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          editorial_description?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number
          route_prefix?: string | null
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["module_status"]
          theme_color?: string | null
          tier?: Database["public"]["Enums"]["module_tier"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          editorial_description?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number
          route_prefix?: string | null
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["module_status"]
          theme_color?: string | null
          tier?: Database["public"]["Enums"]["module_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      cms_numerologia: {
        Row: {
          aprofundamento: string | null
          created_at: string
          descricao: string
          id: string
          manifestacao_copas: string | null
          manifestacao_espadas: string | null
          manifestacao_ouros: string | null
          manifestacao_paus: string | null
          nome: string
          numero: number
          palavras_chave: string[]
          principio: string | null
          reflexao: string | null
          simbolo: string | null
          status: Database["public"]["Enums"]["module_status"]
          subtitulo: string | null
          updated_at: string
        }
        Insert: {
          aprofundamento?: string | null
          created_at?: string
          descricao: string
          id?: string
          manifestacao_copas?: string | null
          manifestacao_espadas?: string | null
          manifestacao_ouros?: string | null
          manifestacao_paus?: string | null
          nome: string
          numero: number
          palavras_chave?: string[]
          principio?: string | null
          reflexao?: string | null
          simbolo?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          subtitulo?: string | null
          updated_at?: string
        }
        Update: {
          aprofundamento?: string | null
          created_at?: string
          descricao?: string
          id?: string
          manifestacao_copas?: string | null
          manifestacao_espadas?: string | null
          manifestacao_ouros?: string | null
          manifestacao_paus?: string | null
          nome?: string
          numero?: number
          palavras_chave?: string[]
          principio?: string | null
          reflexao?: string | null
          simbolo?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          subtitulo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cms_quiz_questions: {
        Row: {
          correct_index: number
          created_at: string
          explanation: string | null
          id: string
          options: Json
          order_index: number
          prompt: string
          quiz_id: string
          updated_at: string
        }
        Insert: {
          correct_index?: number
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          order_index?: number
          prompt: string
          quiz_id: string
          updated_at?: string
        }
        Update: {
          correct_index?: number
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          order_index?: number
          prompt?: string
          quiz_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "cms_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_quizzes: {
        Row: {
          created_at: string
          created_by: string | null
          difficulty: Database["public"]["Enums"]["quiz_difficulty"]
          external_id: string | null
          id: string
          linked_to: string | null
          module_id: string | null
          result_text: string | null
          review_link: string | null
          status: Database["public"]["Enums"]["module_status"]
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"]
          external_id?: string | null
          id?: string
          linked_to?: string | null
          module_id?: string | null
          result_text?: string | null
          review_link?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"]
          external_id?: string | null
          id?: string
          linked_to?: string | null
          module_id?: string | null
          result_text?: string | null
          review_link?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "cms_quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "cms_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_suits: {
        Row: {
          aplicacoes_leitura: string[]
          atmosfera: string | null
          created_at: string
          desafios: string | null
          elemento: string | null
          essencia: string | null
          frase_abertura: string | null
          funcao_na_leitura: string | null
          icone: string | null
          id: string
          linguagem_editorial: string | null
          naipe: Database["public"]["Enums"]["arcano_naipe"]
          nome: string
          palavras_ancora: string[]
          potencial: string | null
          reflexao: string | null
          simbolo_elemento: string | null
          status: Database["public"]["Enums"]["module_status"]
          subtitulo: string | null
          updated_at: string
        }
        Insert: {
          aplicacoes_leitura?: string[]
          atmosfera?: string | null
          created_at?: string
          desafios?: string | null
          elemento?: string | null
          essencia?: string | null
          frase_abertura?: string | null
          funcao_na_leitura?: string | null
          icone?: string | null
          id?: string
          linguagem_editorial?: string | null
          naipe: Database["public"]["Enums"]["arcano_naipe"]
          nome: string
          palavras_ancora?: string[]
          potencial?: string | null
          reflexao?: string | null
          simbolo_elemento?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          subtitulo?: string | null
          updated_at?: string
        }
        Update: {
          aplicacoes_leitura?: string[]
          atmosfera?: string | null
          created_at?: string
          desafios?: string | null
          elemento?: string | null
          essencia?: string | null
          frase_abertura?: string | null
          funcao_na_leitura?: string | null
          icone?: string | null
          id?: string
          linguagem_editorial?: string | null
          naipe?: Database["public"]["Enums"]["arcano_naipe"]
          nome?: string
          palavras_ancora?: string[]
          potencial?: string | null
          reflexao?: string | null
          simbolo_elemento?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          subtitulo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cms_symbol_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          icon: string
          id: string
          name: string
          order_index: number
          slug: string
          status: Database["public"]["Enums"]["module_status"]
          tier: Database["public"]["Enums"]["module_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string
          id?: string
          name: string
          order_index?: number
          slug: string
          status?: Database["public"]["Enums"]["module_status"]
          tier?: Database["public"]["Enums"]["module_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string
          id?: string
          name?: string
          order_index?: number
          slug?: string
          status?: Database["public"]["Enums"]["module_status"]
          tier?: Database["public"]["Enums"]["module_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      cms_symbols: {
        Row: {
          cards: string[]
          category_slug: string
          created_at: string
          explanation: string
          id: string
          name: string
          order_index: number
          readings: string[]
          slug: string
          status: Database["public"]["Enums"]["module_status"]
          updated_at: string
        }
        Insert: {
          cards?: string[]
          category_slug: string
          created_at?: string
          explanation: string
          id?: string
          name: string
          order_index?: number
          readings?: string[]
          slug: string
          status?: Database["public"]["Enums"]["module_status"]
          updated_at?: string
        }
        Update: {
          cards?: string[]
          category_slug?: string
          created_at?: string
          explanation?: string
          id?: string
          name?: string
          order_index?: number
          readings?: string[]
          slug?: string
          status?: Database["public"]["Enums"]["module_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_symbols_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "cms_symbol_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      daily_challenge_completions: {
        Row: {
          challenge_date: string
          challenge_id: string
          created_at: string
          id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          challenge_date?: string
          challenge_id: string
          created_at?: string
          id?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          challenge_date?: string
          challenge_id?: string
          created_at?: string
          id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      daily_ritual_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          items_json: Json | null
          ritual_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          items_json?: Json | null
          ritual_date?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          items_json?: Json | null
          ritual_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gift_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_uses: number
          duration_days: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
        }
        Relationships: []
      }
      gift_redemptions: {
        Row: {
          gift_code_id: string
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          gift_code_id: string
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          gift_code_id?: string
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_redemptions_gift_code_id_fkey"
            columns: ["gift_code_id"]
            isOneToOne: false
            referencedRelation: "gift_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      google_play_subscriptions: {
        Row: {
          acknowledged_at: string | null
          base_plan_id: string
          created_at: string
          expires_at: string | null
          id: string
          order_id: string | null
          product_id: string
          purchase_token: string
          raw_payload: Json | null
          subscription_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          base_plan_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          order_id?: string | null
          product_id: string
          purchase_token: string
          raw_payload?: Json | null
          subscription_status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          base_plan_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string
          purchase_token?: string
          raw_payload?: Json | null
          subscription_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hotmart_entitlements: {
        Row: {
          access_status: string | null
          buyer_email: string
          buyer_email_normalized: string
          buyer_name: string | null
          created_at: string | null
          id: string
          offer_code: string | null
          premium_until: string | null
          product_id: string | null
          product_name: string | null
          source: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_status?: string | null
          buyer_email: string
          buyer_email_normalized: string
          buyer_name?: string | null
          created_at?: string | null
          id?: string
          offer_code?: string | null
          premium_until?: string | null
          product_id?: string | null
          product_name?: string | null
          source?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_status?: string | null
          buyer_email?: string
          buyer_email_normalized?: string
          buyer_name?: string | null
          created_at?: string | null
          id?: string
          offer_code?: string | null
          premium_until?: string | null
          product_id?: string | null
          product_name?: string | null
          source?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hotmart_events: {
        Row: {
          buyer_email: string | null
          buyer_name: string | null
          error_message: string | null
          event_id: string | null
          event_type: string | null
          id: string
          offer_code: string | null
          processed: boolean | null
          processed_at: string | null
          processing_status: string | null
          product_id: string | null
          product_name: string | null
          purchase_status: string | null
          raw_payload: Json | null
          received_at: string | null
          transaction_id: string | null
        }
        Insert: {
          buyer_email?: string | null
          buyer_name?: string | null
          error_message?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string
          offer_code?: string | null
          processed?: boolean | null
          processed_at?: string | null
          processing_status?: string | null
          product_id?: string | null
          product_name?: string | null
          purchase_status?: string | null
          raw_payload?: Json | null
          received_at?: string | null
          transaction_id?: string | null
        }
        Update: {
          buyer_email?: string | null
          buyer_name?: string | null
          error_message?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string
          offer_code?: string | null
          processed?: boolean | null
          processed_at?: string | null
          processing_status?: string | null
          product_id?: string | null
          product_name?: string | null
          purchase_status?: string | null
          raw_payload?: Json | null
          received_at?: string | null
          transaction_id?: string | null
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          error: string | null
          id: string
          sent_at: string | null
          status: string
          type: string
          user_id: string | null
        }
        Insert: {
          error?: string | null
          id?: string
          sent_at?: string | null
          status: string
          type: string
          user_id?: string | null
        }
        Update: {
          error?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          last_sent_at: string | null
          reminder_time: string
          timezone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sent_at?: string | null
          reminder_time?: string
          timezone?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sent_at?: string | null
          reminder_time?: string
          timezone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_beta_tester: boolean
          is_premium: boolean
          premium_source: string | null
          premium_until: string | null
          stripe_customer_id: string | null
          student_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_beta_tester?: boolean
          is_premium?: boolean
          premium_source?: string | null
          premium_until?: string | null
          stripe_customer_id?: string | null
          student_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_beta_tester?: boolean
          is_premium?: boolean
          premium_source?: string | null
          premium_until?: string | null
          stripe_customer_id?: string | null
          student_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          p256dh: string
          platform: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          p256dh: string
          platform?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          p256dh?: string
          platform?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          question_index: number
          quiz_id: string
          selected_answer: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          question_index: number
          quiz_id: string
          selected_answer: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          question_index?: number
          quiz_id?: string
          selected_answer?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      ritual_merits: {
        Row: {
          created_at: string | null
          id: string
          merit_key: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          merit_key: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          merit_key?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ritual_streaks: {
        Row: {
          created_at: string | null
          current_streak: number
          id: string
          last_completed_date: string | null
          longest_streak: number
          streak_protection_available: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number
          id?: string
          last_completed_date?: string | null
          longest_streak?: number
          streak_protection_available?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number
          id?: string
          last_completed_date?: string | null
          longest_streak?: number
          streak_protection_available?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          amount_cents: number | null
          created_at: string
          currency: string | null
          event_type: Database["public"]["Enums"]["subscription_event_type"]
          id: string
          occurred_at: string
          plan_code: string | null
          provider: Database["public"]["Enums"]["billing_provider"]
          provider_customer_id: string | null
          provider_event_id: string | null
          provider_subscription_id: string | null
          raw_payload: Json
          user_id: string | null
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          event_type: Database["public"]["Enums"]["subscription_event_type"]
          id?: string
          occurred_at?: string
          plan_code?: string | null
          provider: Database["public"]["Enums"]["billing_provider"]
          provider_customer_id?: string | null
          provider_event_id?: string | null
          provider_subscription_id?: string | null
          raw_payload?: Json
          user_id?: string | null
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          event_type?: Database["public"]["Enums"]["subscription_event_type"]
          id?: string
          occurred_at?: string
          plan_code?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"]
          provider_customer_id?: string | null
          provider_event_id?: string | null
          provider_subscription_id?: string | null
          raw_payload?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_name: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_name: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          badges: Json
          certificates_earned: Json
          completed_exercises: string[]
          completed_lessons: string[]
          completed_modules: string[]
          completed_quizzes: string[]
          created_at: string
          current_module: string
          id: string
          last_active: string
          level: number
          onboarding_completed: boolean
          streak: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          badges?: Json
          certificates_earned?: Json
          completed_exercises?: string[]
          completed_lessons?: string[]
          completed_modules?: string[]
          completed_quizzes?: string[]
          created_at?: string
          current_module?: string
          id?: string
          last_active?: string
          level?: number
          onboarding_completed?: boolean
          streak?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          badges?: Json
          certificates_earned?: Json
          completed_exercises?: string[]
          completed_lessons?: string[]
          completed_modules?: string[]
          completed_quizzes?: string[]
          created_at?: string
          current_module?: string
          id?: string
          last_active?: string
          level?: number
          onboarding_completed?: boolean
          streak?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      user_reflections: {
        Row: {
          arcano_id: string
          content: string
          created_at: string
          id: string
          lesson_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          arcano_id: string
          content: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          arcano_id?: string
          content?: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_arcano_backfill: { Args: { _payload: Json }; Returns: Json }
      cms_arcanos_essential_count: {
        Args: { a: Database["public"]["Tables"]["cms_arcanos"]["Row"] }
        Returns: number
      }
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { role_name: string; user_id: string }; Returns: boolean }
      manually_release_hotmart_access: {
        Args: { p_email: string; p_transaction_id: string }
        Returns: Json
      }
      redeem_gift_code: {
        Args: { _code: string; _user_id: string }
        Returns: Json
      }
      secure_complete_lesson: {
        Args: { _lesson_id: string }
        Returns: undefined
      }
      secure_earn_badge: { Args: { _badge_id: string }; Returns: undefined }
      validate_certificate: {
        Args: { _code: string }
        Returns: {
          course_name: string
          issued_at: string
          status: string
          student_name: string
          workload_hours: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "auditor"
      arcano_naipe: "copas" | "ouros" | "espadas" | "paus"
      arcano_type: "maior" | "menor"
      billing_provider: "stripe" | "paddle" | "revenuecat" | "manual"
      feedback_status: "aberto" | "em_andamento" | "resolvido"
      module_status: "empty" | "partial" | "draft" | "published"
      module_tier: "free" | "premium"
      quiz_difficulty: "easy" | "medium" | "hard"
      subscription_event_type:
        | "checkout_completed"
        | "subscription_created"
        | "subscription_renewed"
        | "subscription_cancelled"
        | "subscription_expired"
        | "payment_succeeded"
        | "payment_failed"
        | "refund_issued"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "auditor"],
      arcano_naipe: ["copas", "ouros", "espadas", "paus"],
      arcano_type: ["maior", "menor"],
      billing_provider: ["stripe", "paddle", "revenuecat", "manual"],
      feedback_status: ["aberto", "em_andamento", "resolvido"],
      module_status: ["empty", "partial", "draft", "published"],
      module_tier: ["free", "premium"],
      quiz_difficulty: ["easy", "medium", "hard"],
      subscription_event_type: [
        "checkout_completed",
        "subscription_created",
        "subscription_renewed",
        "subscription_cancelled",
        "subscription_expired",
        "payment_succeeded",
        "payment_failed",
        "refund_issued",
      ],
    },
  },
} as const
