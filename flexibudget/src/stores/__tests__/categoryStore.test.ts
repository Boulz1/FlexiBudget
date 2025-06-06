import { useCategoryStore } from '../categoryStore'
import { useTransactionStore } from '../transactionStore'
import { vi, describe, it, expect, beforeEach } from 'vitest'

interface Transaction {
  id: string
  amount: number
  date: string
  description: string
  type: 'expense' | 'income'
  categoryId: string
}

describe('useCategoryStore.deleteCategory', () => {
  beforeEach(() => {
    useCategoryStore.setState({ categories: [] })
    useTransactionStore.setState({ transactions: [] })
    vi.stubGlobal('alert', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('refuses to remove a category used by transactions', () => {
    useCategoryStore.setState({ categories: [{ id: 'c1', name: 'Food', type: 'expense' }] })
    const transaction: Transaction = {
      id: 't1',
      amount: 10,
      date: '2024-01-01',
      description: 'test',
      type: 'expense',
      categoryId: 'c1'
    }
    useTransactionStore.setState({ transactions: [transaction] })

    const result = useCategoryStore.getState().deleteCategory('c1')

    expect(result).toBe(false)
    expect(useCategoryStore.getState().categories).toHaveLength(1)
    expect(global.alert).toHaveBeenCalled()
  })
})
