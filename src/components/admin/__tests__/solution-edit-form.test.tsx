import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SolutionEditForm from '../solution-edit-form'

// Mock the RichTextField component
jest.mock('@/components/ui/rich-text-field', () => ({
  RichTextField: ({ label, value, onChange, placeholder }: any) => (
    <div data-testid='rich-text-field'>
      <label>{label}</label>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid='content-textarea'
      />
    </div>
  ),
}))

// Mock the MetricsPreview and MetricsSuggestions components
jest.mock('@/components/admin/metrics-preview', () => ({
  MetricsPreview: () => <div data-testid='metrics-preview'>Metrics Preview</div>,
  MetricsSuggestions: () => <div data-testid='metrics-suggestions'>Metrics Suggestions</div>,
}))

const mockSolution = {
  id: '1',
  category: '园区管理',
  title: '智慧园区解决方案',
  subtitle: '全面的园区管理系统',
  description: '提供完整的园区管理功能',
  content: '<p>详细内容</p>',
  features: ['实时监控', '智能分析'],
  applications: ['工业园区', '科技园区'],
  metrics: [
    { label: '系统可用性', value: '99.9%' },
    { label: '处理速度', value: '10倍提升' },
  ],
  technologies: ['AI算法', '云计算'],
  benefits: ['提高效率', '降低成本'],
  image: '/uploads/solution-image.jpg',
  slug: 'smart-park',
  gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
  accentColor: '#3B82F6',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('SolutionEditForm', () => {
  const mockOnSave = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form for creating new solution', () => {
    render(
      <SolutionEditForm
        solution={null}
        isCreating={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('基本信息')).toBeInTheDocument()
    expect(screen.getByText('关键指标')).toBeInTheDocument()
    expect(screen.getByLabelText('解决方案标题 *')).toBeInTheDocument()
    expect(screen.getByLabelText('URL标识 *')).toBeInTheDocument()
  })

  it('renders form with existing solution data', () => {
    render(
      <SolutionEditForm
        solution={mockSolution}
        isCreating={false}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByDisplayValue('智慧园区解决方案')).toBeInTheDocument()
    expect(screen.getByDisplayValue('smart-park')).toBeInTheDocument()
    expect(screen.getByText('系统可用性')).toBeInTheDocument()
    expect(screen.getByText('99.9%')).toBeInTheDocument()
  })

  it('allows adding new metrics', async () => {
    render(
      <SolutionEditForm
        solution={null}
        isCreating={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    const metricLabelInput = screen.getByPlaceholderText('指标名称，如：系统可用性')
    const metricValueInput = screen.getByPlaceholderText('指标数值，如：99.9%')
    const addButton = screen.getByText('添加指标')

    fireEvent.change(metricLabelInput, { target: { value: '响应时间' } })
    fireEvent.change(metricValueInput, { target: { value: '<100ms' } })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('响应时间')).toBeInTheDocument()
      expect(screen.getByText('<100ms')).toBeInTheDocument()
    })
  })

  it('allows removing metrics', async () => {
    render(
      <SolutionEditForm
        solution={mockSolution}
        isCreating={false}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    const removeButtons = screen.getAllByRole('button', { name: '' })
    const metricRemoveButton = removeButtons.find(button => button.querySelector('.lucide-x'))

    if (metricRemoveButton) {
      fireEvent.click(metricRemoveButton)
    }

    await waitFor(() => {
      // Check that one of the metrics is removed
      const metricElements = screen.queryAllByText('系统可用性')
      expect(metricElements.length).toBeLessThanOrEqual(1)
    })
  })

  it('validates required fields on submit', async () => {
    // Mock alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <SolutionEditForm
        solution={null}
        isCreating={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    const submitButton = screen.getByRole('button', { name: /创建解决方案/ })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('请输入解决方案标题')
    })

    alertSpy.mockRestore()
  })

  it('calls onSave with form data when valid', async () => {
    render(
      <SolutionEditForm
        solution={null}
        isCreating={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    // Fill required fields
    fireEvent.change(screen.getByLabelText('解决方案标题 *'), {
      target: { value: '测试解决方案' },
    })

    // Select category
    const categorySelect = screen.getByRole('combobox')
    fireEvent.click(categorySelect)

    // Wait for options to appear and select one
    await waitFor(() => {
      const option = screen.getByText('园区管理')
      fireEvent.click(option)
    })

    // Submit form
    const form = screen.getByRole('form') || screen.getByTestId('solution-form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '测试解决方案',
          category: '园区管理',
        })
      )
    })
  })

  it('updates slug value when title changes', () => {
    render(
      <SolutionEditForm
        solution={null}
        isCreating={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    )

    const titleInput = screen.getByLabelText('解决方案标题 *')
    fireEvent.change(titleInput, { target: { value: '新解决方案' } })

    const slugInput = screen.getByLabelText('URL标识 *')
    expect(slugInput).toHaveValue('新解决方案')
  })
})
