import dynamic from 'next/dynamic'

export const Dialog = dynamic(() => import('./Dialog.client').then(mod => mod.Dialog), {
  ssr: false
})

export const DialogTitle = dynamic(() => import('./Dialog.client').then(mod => mod.DialogTitle), {
  ssr: false
})

export const DialogBody = dynamic(() => import('./Dialog.client').then(mod => mod.DialogBody), {
  ssr: false
})
