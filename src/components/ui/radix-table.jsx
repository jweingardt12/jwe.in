import { Table, Theme } from '@radix-ui/themes'

export function GhostTable({ children }) {
  return (
    <Theme>
      <Table.Root size="1" variant="ghost">
        <Table.Body>
          {children}
        </Table.Body>
      </Table.Root>
    </Theme>
  )
}

export function TableRow({ children }) {
  return <Table.Row>{children}</Table.Row>
}

export function TableCell({ children }) {
  return <Table.Cell>{children}</Table.Cell>
}
