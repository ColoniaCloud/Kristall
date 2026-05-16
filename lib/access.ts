import type { Access, FieldAccess } from 'payload'

// Collection-level access control
export const isAdmin: Access = ({ req }) => {
  const userRole = req.user?.role
  return ['super-admin', 'admin'].includes(userRole)
}

export const isSalesOrAdmin: Access = ({ req }) => {
  const userRole = req.user?.role
  return ['super-admin', 'admin', 'ventas'].includes(userRole)
}

export const isAdminOrContent: Access = ({ req }) => {
  const userRole = req.user?.role
  return ['super-admin', 'admin', 'contenido'].includes(userRole)
}

// Field-level access control (only returns boolean)
export const isAdminField: FieldAccess = ({ req }) => {
  const userRole = req?.user?.role
  return ['super-admin', 'admin'].includes(userRole || '')
}

export const isSalesOrAdminField: FieldAccess = ({ req }) => {
  const userRole = req?.user?.role
  return ['super-admin', 'admin', 'ventas'].includes(userRole || '')
}

export const isAdminOrContentField: FieldAccess = ({ req }) => {
  const userRole = req?.user?.role
  return ['super-admin', 'admin', 'contenido'].includes(userRole || '')
}
