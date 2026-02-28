import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Section,
  SKKNFormData,
  OutlineItem,
  WrittenSection,
  StepType,
  DEFAULT_TEMPLATES,
} from './types'

interface SKKNState {
  // Current step
  currentStep: StepType
  setCurrentStep: (step: StepType) => void

  // Template
  templateFile: File | null
  templateText: string
  templateStructure: Section[]
  setTemplateFile: (file: File | null) => void
  setTemplateText: (text: string) => void
  setTemplateStructure: (structure: Section[]) => void
  useDefaultTemplate: (templateName: string) => void

  // Form data
  formData: SKKNFormData
  updateFormData: (data: Partial<SKKNFormData>) => void

  // Outline
  outline: OutlineItem[]
  setOutline: (outline: OutlineItem[]) => void
  updateOutlineItem: (id: string, updates: Partial<OutlineItem>) => void

  // Sections
  sections: WrittenSection[]
  addSection: (section: WrittenSection) => void
  updateSection: (id: string, updates: Partial<WrittenSection>) => void
  clearSections: () => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Reset
  resetAll: () => void
}

const initialFormData: SKKNFormData = {
  topicName: '',
  subject: 'Toán',
  level: 'THPT',
  grade: '',
  school: '',
  author: '',
  researchSubjects: '',
  solutionCount: 3,
  targetPages: 15,
  specialRequirements: '',
  includeRealProblems: false,
}

export const useSKKNStore = create<SKKNState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 'upload',
      templateFile: null,
      templateText: '',
      templateStructure: [],
      formData: initialFormData,
      outline: [],
      sections: [],
      isLoading: false,

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      setTemplateFile: (file) => set({ templateFile: file }),

      setTemplateText: (text) => set({ templateText: text }),

      setTemplateStructure: (structure) => set({ templateStructure: structure }),

      useDefaultTemplate: (templateName) => {
        const template = DEFAULT_TEMPLATES.find((t) => t.name === templateName)
        if (template) {
          set({
            templateStructure: template.sections,
            templateText: template.sections
              .map((s) => `${s.title}\n${s.description}`)
              .join('\n\n'),
          })
        }
      },

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setOutline: (outline) => set({ outline }),

      updateOutlineItem: (id, updates) =>
        set((state) => ({
          outline: state.outline.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      addSection: (section) =>
        set((state) => ({
          sections: [...state.sections, section],
        })),

      updateSection: (id, updates) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id ? { ...section, ...updates } : section
          ),
        })),

      clearSections: () => set({ sections: [] }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      resetAll: () =>
        set({
          currentStep: 'upload',
          templateFile: null,
          templateText: '',
          templateStructure: [],
          formData: initialFormData,
          outline: [],
          sections: [],
          isLoading: false,
        }),
    }),
    {
      name: 'skkn-storage',
      partialize: (state) => ({
        formData: state.formData,
        templateStructure: state.templateStructure,
        outline: state.outline,
        sections: state.sections,
      }),
    }
  )
)
