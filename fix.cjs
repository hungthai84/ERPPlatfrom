const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  LayoutGrid, 
  List, 
  Download, 
  Trash2, 
  Edit3, 
  Plus, 
  Search,
  CheckCircle2,
  Clock,
  FileText,
  X,
  CalendarCheck,
  Users,
  DollarSign,
  Filter,
  MoreVertical,
  Briefcase
} from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  dueDate: string;
  startDate?: string;
  parentProjectId?: string;
  taskListIds?: string[];
  department?: string;
}

const fallbackProjects: ProjectData[] = [
  {
    id: 'proj-1',
    name: 'Nâng cấp Hệ thống Nhân sự Core',
    description: 'Nâng cấp toàn diện cơ sở hạ tầng, tối ưu hóa các quy trình quản lý thông tin nhân viên.',
    status: 'active',
    dueDate: '2026-08-31',
    department: 'HR'
  },
  {
    id: 'proj-2',
    name: 'Đo lường & Đồng bộ OKRs doanh nghiệp',
    description: 'Xây dựng giải pháp phần mềm tự động giúp theo dõi mục tiêu then chốt của từng phòng ban.',
    status: 'active',
    dueDate: '2026-09-15',
    department: 'IT'
  },
  {
    id: 'proj-3',
    name: 'Chiến dịch Quảng bá Sản phẩm 2026',
    description: 'Phát triển thương hiệu số thông qua các kênh truyền thông trực tuyến và sự kiện khách hàng.',
    status: 'on_hold',
    dueDate: '2026-10-01',
    department: 'Marketing'
  },
  {
    id: 'proj-4',
    name: 'Tối ưu hóa SLA kỹ thuật',
    description: 'Giảm thời gian phản hồi yêu cầu hỗ trợ khách hàng từ 4 giờ xuống còn dưới 1 giờ.',
    status: 'completed',
    dueDate: '2026-06-30',
    department: 'IT'
  }
];

export default function DuAnTab() {
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    const saved = localStorage.getItem('mock_projects');
    return saved ? JSON.parse(saved) : fallbackProjects;
  });
  
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks'>('projects');
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState<'all' | 'overdue' | 'this_week' | 'this_month'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentProject, setCurrentProject] = useState<Partial<ProjectData>>({
    status: 'active',
    name: '',
    description: '',
    department: 'None'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newProj: ProjectData = {
        ...currentProject,
        id: \`proj-\${Date.now()}\`,
        dueDate: currentProject.dueDate || new Date().toISOString().split('T')[0],
        status: currentProject.status || 'active',
        name: currentProject.name || '',
        description: currentProject.description || '',
        department: currentProject.department || 'None'
      } as ProjectData;
      
      const updated = [...projects, newProj];
      setProjects(updated);
      localStorage.setItem('mock_projects', JSON.stringify(updated));
      showToast('Đã thêm dự án mới thành công!');
    } else if (currentProject.id) {
      const updated = projects.map(p => p.id === currentProject.id ? { ...p, ...currentProject } as ProjectData : p);
      setProjects(updated);
      localStorage.setItem('mock_projects', JSON.stringify(updated));
      showToast('Đã cập nhật dự án thành công!');
    }
    setShowAddModal(false);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('mock_projects', JSON.stringify(updated));
      showToast('Đã xóa dự án.');
    }
  };

  const getFilteredProjects = () => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDepartment === 'all' || p.department === selectedDepartment;
      
      let matchesDate = true;
      if (dueDateFilter !== 'all' && p.dueDate) {
        const due = new Date(p.dueDate);
        const now = new Date();
        if (dueDateFilter === 'overdue') matchesDate = due < now && p.status !== 'completed';
        else if (dueDateFilter === 'this_week') {
          const nextWeek = new Date();
          nextWeek.setDate(now.getDate() + 7);
          matchesDate = due >= now && due <= nextWeek;
        } else if (dueDateFilter === 'this_month') {
          matchesDate = due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
        }
      }

      return matchesSearch && matchesDept && matchesDate;
    });
  };

  const calculateProjectProgress = (p: ProjectData) => {
    if (p.status === 'completed') return 100;
    return Math.floor(Math.random() * 80) + 10;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Danh sach Du an', 14, 15);
    const data = getFilteredProjects().map(p => [p.name, p.status, p.department || 'None', p.dueDate]);
    autoTable(doc, {
      head: [['Ten du an', 'Trang thai', 'Phong ban', 'Han chot']],
      body: data,
      startY: 20
    });
    doc.save('danh-sach-du-an.pdf');
  };

  const handleExportCSV = () => {
    const headers = ['Tên dự án,Trạng thái,Phòng ban,Hạn chót'];
    const rows = getFilteredProjects().map(p => \`\${p.name},\${p.status},\${p.department || 'None'},\${p.dueDate}\`);
    const csv = [headers, ...rows].join('\\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh-sach-du-an.csv';
    a.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-100 uppercase tracking-tighter">Đang chạy</span>;
      case 'completed': return <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-tighter">Hoàn thành</span>;
      case 'on_hold': return <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-100 uppercase tracking-tighter">Tạm dừng</span>;
      default: return null;
    }
  };

  const openAddModal = (parentId?: string) => {
    setModalMode('add');
    setCurrentProject({ status: 'active', name: '', description: '', department: 'None', parentProjectId: parentId });
    setShowAddModal(true);
  };

  const openEditModal = (project: ProjectData) => {
    setModalMode('edit');
    setCurrentProject(project);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Head Title for the original simple view */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Dự án & Công việc</h1>
        </div>
        <button 
          onClick={() => openAddModal()}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium hover:shadow-md transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Dự án</span>
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('projects')}
          className={\`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all \${
            activeTab === 'projects' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          }\`}
        >
          <Briefcase className="w-4 h-4" /> Dự án
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={\`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all \${
            activeTab === 'tasks' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          }\`}
        >
          <CheckCircle2 className="w-4 h-4" /> Công việc
        </button>
      </div>

      {activeTab === 'projects' ? (
        <div className="space-y-6">
          {/* Chart Section */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="flex-1 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Thống kê Dự án</h3>
              <div className="space-y-2">
                {[
                  { label: 'Đang thực hiện', count: projects.filter(p => p.status === 'active').length, color: 'bg-blue-500' },
                  { label: 'Đã hoàn thành', count: projects.filter(p => p.status === 'completed').length, color: 'bg-green-500' },
                  { label: 'Tạm dừng', count: projects.filter(p => p.status === 'on_hold').length, color: 'bg-yellow-500' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-500 uppercase tracking-wider text-[10px]">
                      <span className={\`w-2.5 h-2.5 rounded-full \${item.color}\`}></span>
                      {item.label}
                    </span>
                    <span className="text-slate-800">{item.count} dự án</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 h-32 w-full max-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Đang thực hiện', value: projects.filter(p => p.status === 'active').length, color: '#3B82F6' },
                      { name: 'Đã hoàn thành', value: projects.filter(p => p.status === 'completed').length, color: '#10B981' },
                      { name: 'Tạm dừng', value: projects.filter(p => p.status === 'on_hold').length, color: '#F59E0B' },
                    ].filter(d => d.value > 0)}
                    cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value"
                  >
                    {[
                      { name: 'Đang thực hiện', value: projects.filter(p => p.status === 'active').length, color: '#3B82F6' },
                      { name: 'Đã hoàn thành', value: projects.filter(p => p.status === 'completed').length, color: '#10B981' },
                      { name: 'Tạm dừng', value: projects.filter(p => p.status === 'on_hold').length, color: '#F59E0B' },
                    ].filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800">Danh sách dự án</h2>
                <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200 shadow-inner">
                  <button
                    onClick={() => setViewMode('list')}
                    className={\`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 \${
                      viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                    }\`}
                  >
                    <List className="w-3.5 h-3.5" /> Bảng
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={\`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 \${
                      viewMode === 'timeline' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                    }\`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Gantt
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleExportPDF} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button onClick={handleExportCSV} className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-10 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phòng ban:</span>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
                >
                  <option value="all">Tất cả</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="None">Khác</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thời hạn:</span>
                <select
                  value={dueDateFilter}
                  onChange={(e) => setDueDateFilter(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
                >
                  <option value="all">Tất cả</option>
                  <option value="overdue">Quá hạn</option>
                  <option value="this_week">Tuần này</option>
                  <option value="this_month">Tháng này</option>
                </select>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tên dự án</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái / Tiến độ</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Hạn chót</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {getFilteredProjects().map(project => (
                      <tr key={project.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-extrabold text-slate-800">{project.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                              {project.department ? \`Phòng \${project.department}\` : 'Chưa phân loại'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {getStatusBadge(project.status)}
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: \`\${calculateProjectProgress(project)}%\` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-500">{calculateProjectProgress(project)}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-bold text-slate-600">
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString('vi-VN') : '---'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditModal(project)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteProject(project.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[200px] bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
                <div className="text-center">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">Tính năng Gantt Chart đang được phát triển.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mr-auto">Công việc</h3>
            <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-600">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-600">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-3">
            {[
              { text: 'Kiểm tra kho vật tư', completed: true },
              { text: 'Quản lý đội giao hàng', completed: true },
              { text: 'Liên hệ Selma: Xác nhận', completed: false },
              { text: 'Cập nhật danh mục sản phẩm', completed: true },
              { text: 'Tính toán lợi nhuận', completed: false }
            ].map((todo, idx) => (
              <li key={idx} className={\`flex items-center justify-between p-4 rounded-xl bg-gray-50/80 border-l-[6px] shadow-sm hover:shadow-md transition cursor-pointer \${todo.completed ? 'border-blue-500' : 'border-orange-400'}\`}>
                <p className={\`text-sm font-semibold \${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}\`}>
                  {todo.text}
                </p>
                <button className="p-1.5 hover:bg-gray-200 rounded-md transition">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                {modalMode === 'add' ? 'Thêm dự án mới' : 'Chỉnh sửa dự án'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tên dự án</label>
                <input 
                  type="text" 
                  required 
                  value={currentProject.name || ''} 
                  onChange={e => setCurrentProject({...currentProject, name: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phòng ban</label>
                  <select 
                    value={currentProject.department || 'None'} 
                    onChange={e => setCurrentProject({...currentProject, department: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  >
                    <option value="None">Chưa phân loại</option>
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hạn chót</label>
                  <input 
                    type="date" 
                    value={currentProject.dueDate || ''} 
                    onChange={e => setCurrentProject({...currentProject, dueDate: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Trạng thái</label>
                <div className="flex gap-2">
                  {['active', 'completed', 'on_hold'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCurrentProject({...currentProject, status: s as 'active' | 'completed' | 'on_hold'})}
                      className={\`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border \${
                        currentProject.status === s 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-slate-500 border-gray-200 hover:border-blue-200'
                      }\`}
                    >
                      {s === 'active' ? 'Đang chạy' : s === 'completed' ? 'Xong' : 'Tạm dừng'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Lưu dự án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/components/DuAnTab.tsx', content);
