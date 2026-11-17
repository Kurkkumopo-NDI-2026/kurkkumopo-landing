import { createContext, useContext } from 'react'
import { MESSAGES, type Lang, type Messages } from './messages'

export interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Messages
}

export const I18nContext = createContext<I18n>({ lang: 'fr', setLang: () => {}, t: MESSAGES.fr })

export const useI18n = () => useContext(I18nContext)
