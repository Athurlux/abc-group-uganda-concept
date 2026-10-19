// The CV picker only inspects a file's name, type and size in the browser. The file
// is never read, uploaded, parsed or stored; the draft keeps a short description.

export const CV_MAX_BYTES = 2 * 1024 * 1024
export const CV_ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const EXTENSIONS = ['pdf', 'doc', 'docx']
const TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export interface FileFacts {
  name: string
  type: string
  size: number
}

export function cvFileError(file: FileFacts): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  // Some systems report an empty MIME type for Word files, so the extension decides then.
  if (!EXTENSIONS.includes(extension) || (file.type && !TYPES.includes(file.type))) return 'Choose a PDF or Word document (.pdf, .doc or .docx).'
  if (file.size === 0) return 'That file is empty. Choose another document.'
  if (file.size > CV_MAX_BYTES) return 'Choose a file of 2 MB or less.'
  return null
}

export function describeFile(file: FileFacts) {
  const size = file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`
  return `${file.name} (${size})`
}
