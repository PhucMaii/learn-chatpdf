import React from 'react'
import { Table, TableHead, TableHeader, TableRow } from '../ui/table'

export default function QuizzesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Quiz</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  )
}
