import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from './types';

interface ExportPdfOptions {
  transactions: Transaction[];
  title?: string;
  userEmail?: string;
  monthLabel?: string;
  yearLabel?: string | number;
  typeFilter?: 'all' | 'income' | 'expense';
  categoryFilter?: string;
}

export const exportTransactionsToPdf = ({
  transactions,
  title = 'Laporan Keuangan Bulanan',
  userEmail = 'lutfi.maulana.rusli@gmail.com',
  monthLabel,
  yearLabel,
  typeFilter = 'all',
  categoryFilter = 'all',
}: ExportPdfOptions) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Filter transactions
  let data = [...transactions];
  if (typeFilter !== 'all') {
    data = data.filter((t) => t.type === typeFilter);
  }
  if (categoryFilter !== 'all') {
    data = data.filter((t) => t.category_name === categoryFilter || t.category_id === categoryFilter);
  }

  // Format currency
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Calculate totals
  const totalIncome = data
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = data
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netBalance = totalIncome - totalExpense;

  // Colors & Header Styling
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ArthaKu', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${title}`, 14, 25);
  if (monthLabel && yearLabel) {
    doc.text(`Periode: ${monthLabel} ${yearLabel}`, 14, 31);
  }

  doc.setFontSize(9);
  doc.text(`Pemilik Akun: ${userEmail}`, 196, 18, { align: 'right' });
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 196, 25, { align: 'right' });

  // Summary Section Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 46, 182, 22, 3, 3, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Ringkasan Keuangan:', 18, 53);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 163, 74); // Green
  doc.text(`Total Pemasukan: ${formatIDR(totalIncome)}`, 18, 61);

  doc.setTextColor(225, 29, 72); // Red
  doc.text(`Total Pengeluaran: ${formatIDR(totalExpense)}`, 85, 61);

  doc.setTextColor(15, 23, 42); // Slate
  doc.setFont('helvetica', 'bold');
  doc.text(`Saldo Bersih: ${formatIDR(netBalance)}`, 150, 61);

  // Table Setup
  const tableData = data.map((t, idx) => [
    idx + 1,
    t.date,
    t.is_reimbursable ? `${t.title}\n(Reimburse ke: ${t.reimburse_to})` : t.title,
    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    t.category_name || 'Lainnya',
    `${t.type === 'income' ? '+' : '-'} ${formatIDR(t.amount)}`,
  ]);

  autoTable(doc, {
    startY: 74,
    head: [['No', 'Tanggal', 'Nama Barang / Deskripsi', 'Jenis', 'Kategori', 'Nominal (Rp)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 25 },
      2: { cellWidth: 65 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
      5: { cellWidth: 27, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // Save PDF
  const filename = `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
