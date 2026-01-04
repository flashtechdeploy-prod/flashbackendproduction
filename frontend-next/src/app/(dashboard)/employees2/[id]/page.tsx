"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  Typography,
  Row,
  Col,
  Button,
  Space,
  Spin,
  App,
  Avatar,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { api } from "@/lib/api";

const { Title, Text } = Typography;

interface Employee2 {
  id: number;
  serial_no: string | null;
  fss_no: string | null;
  rank: string | null;
  name: string;
  father_name: string | null;
  salary: string | null;
  status: string | null;
  unit: string | null;
  service_rank: string | null;
  blood_group: string | null;
  status2: string | null;
  unit2: string | null;
  rank2: string | null;
  cnic: string | null;
  dob: string | null;
  cnic_expiry: string | null;
  documents_held: string | null;
  documents_handed_over_to: string | null;
  photo_on_doc: string | null;
  personal_signature: string | null;
  fingerprint_thumb: string | null;
  fingerprint_index: string | null;
  fingerprint_middle: string | null;
  fingerprint_ring: string | null;
  fingerprint_pinky: string | null;
  employment_agreement: string | null;
  eobi_no: string | null;
  insurance: string | null;
  social_security: string | null;
  mobile_no: string | null;
  home_contact: string | null;
  verified_by_sho: string | null;
  verified_by_khidmat_markaz: string | null;
  domicile: string | null;
  verified_by_ssp: string | null;
  enrolled: string | null;
  re_enrolled: string | null;
  village: string | null;
  post_office: string | null;
  thana: string | null;
  tehsil: string | null;
  district: string | null;
  duty_location: string | null;
  address_details: string | null;
  temp_village: string | null;
  temp_post_office: string | null;
  temp_thana: string | null;
  temp_tehsil: string | null;
  temp_district: string | null;
  temp_city: string | null;
  temp_phone: string | null;
  temp_address_details: string | null;
  police_trg_ltr_date: string | null;
  vaccination_cert: string | null;
  vol_no: string | null;
  payments: string | null;
  category: string | null;
  designation: string | null;
  allocation_status: string | null;
  avatar_url: string | null;
  cnic_attachment: string | null;
  domicile_attachment: string | null;
  sho_verified_attachment: string | null;
  ssp_verified_attachment: string | null;
  khidmat_verified_attachment: string | null;
  police_trg_attachment: string | null;
  photo_on_doc_attachment: string | null;
  personal_signature_attachment: string | null;
  fingerprint_thumb_attachment: string | null;
  fingerprint_index_attachment: string | null;
  fingerprint_middle_attachment: string | null;
  fingerprint_ring_attachment: string | null;
  fingerprint_pinky_attachment: string | null;
  employment_agreement_attachment: string | null;
  served_in_attachment: string | null;
  vaccination_attachment: string | null;
  recording_officer_signature_attachment: string | null;
  experience_security_attachment: string | null;
  education_attachment: string | null;
  nok_cnic_attachment: string | null;
  other_documents_attachment: string | null;
  bank_accounts: string | null;
  height: string | null;
  education: string | null;
  medical_details: string | null;
  medical_category: string | null;
  medical_discharge_cause: string | null;
  nok_name: string | null;
  nok_relationship: string | null;
  sons_count: string | null;
  daughters_count: string | null;
  brothers_count: string | null;
  sisters_count: string | null;
  interviewed_by: string | null;
  introduced_by: string | null;
  enrolled_as: string | null;
  served_in: string | null;
  experience_security: string | null;
  deployment_details: string | null;
  deployed_at?: string | null;
  bdm_name?: string | null;
  employment_agreement_date?: string | null;
  personal_mobile?: string | null;
  nok_cnic?: string | null;
  nok_mobile?: string | null;
  recording_officer_signature?: string | null;
  individual_signature?: string | null;
  dod: string | null;
  discharge_cause: string | null;
  orig_docs_received: string | null;
  created_at: string;
  updated_at: string | null;
}

export default function EmployeeDetailPage() {
  const { message } = App.useApp();
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportAttachmentsVisible, setExportAttachmentsVisible] = useState(false);

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Employee2>(`/api/employees2/${params.id}`);
      setEmployee(data);
    } catch {
      message.error("Failed to load employee details");
    } finally {
      setLoading(false);
    }
  }, [params.id, message]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "80vh", gap: 16 }}>
        <Spin size="large" />
        <Text type="secondary">Fetching Profile Details...</Text>
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <InfoCircleOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
        <Title level={3}>Profile Not Found</Title>
        <Text type="secondary">We couldn&apos;t find the record you were looking for.</Text>
        <div style={{ marginTop: 24 }}>
          <Button type="primary" size="large" onClick={() => router.push("/employees2")}>Return to Master List</Button>
        </div>
      </div>
    );
  }

  const borderColor = "#e5e7eb";

  const pageStyle: CSSProperties = {
    padding: "28px 88px",
    background: "#ffffff",
    minHeight: "100vh",
  };

  const contentStyle: CSSProperties = {
    maxWidth: 1000,
    margin: "0 auto",
  };

  const sectionStyle: CSSProperties = {
    marginBottom: 16,
    border: `1px solid ${borderColor}`,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 4,
  };

  const rowGutter: [number, number] = [12, 12];
  const tightRowGutter: [number, number] = [8, 8];
  const labelStyle: CSSProperties = { fontSize: 11, fontWeight: 500, color: "#64748b" };
  const valueStyle: CSSProperties = { fontSize: 13, color: "#0f172a" };
  const labelRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 18,
  };

  const val = (v: string | null | undefined) => (v && String(v).trim() ? v : "-");

  const openUrl = (url: string | null) => {
    if (!url) return;
    window.open(`${api.baseUrl}${url}`, "_blank");
  };

  const safeFileName = (v: string): string => {
    return String(v || "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-]/g, "")
      .slice(0, 80);
  };

  const fetchArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
    return await res.arrayBuffer();
  };

  const appendPdfAttachment = async (merged: PDFDocument, title: string, url: string) => {
    const page = merged.addPage([595.28, 841.89]);
    const font = await merged.embedFont(StandardFonts.HelveticaBold);
    page.drawText(title, { x: 40, y: 800, size: 16, font, color: rgb(0.06, 0.09, 0.16) });
    page.drawText(url, { x: 40, y: 780, size: 9, font: await merged.embedFont(StandardFonts.Helvetica), color: rgb(0.2, 0.2, 0.2) });

    const ab = await fetchArrayBuffer(url);
    const src = await PDFDocument.load(ab);
    const pages = await merged.copyPages(src, src.getPageIndices());
    for (const p of pages) merged.addPage(p);
  };

  const handleExportPdf = async () => {
    if (exportingPdf) return;

    const target = document.getElementById("employees2-profile-pdf-export") as HTMLDivElement | null;
    if (!target) {
      message.error("Unable to export PDF: content not found");
      return;
    }

    try {
      setPhotoPreviewOpen(false);
      setExportingPdf(true);
      setExportAttachmentsVisible(true);

      await new Promise((r) => window.setTimeout(r, 200));

      const canvas = await html2canvas(target, {
        backgroundColor: "#ffffff",
        scale: Math.max(3, Math.min(4, window.devicePixelRatio || 1)),
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 1) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const basePdfBytes = pdf.output("arraybuffer");
      const merged = await PDFDocument.load(basePdfBytes);

      const pdfAttachmentItems = attachmentItems
        .filter((x) => isPdfUrl(x.url))
        .map((x) => ({ title: x.title, url: `${api.baseUrl}${x.url}` }));

      for (const att of pdfAttachmentItems) {
        try {
          await appendPdfAttachment(merged, att.title, att.url);
        } catch (e) {
          console.warn("Failed to append attachment pdf:", att, e);
        }
      }

      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `personal_file_${safeFileName(employee?.name || "employee")}_${String(employee?.id || params.id)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export PDF error:", e);
      message.error("Failed to export PDF");
    } finally {
      setExportAttachmentsVisible(false);
      setExportingPdf(false);
    }
  };

  const isPdfUrl = (url: string) => /\.pdf(\?.*)?$/i.test(url);

  const fileNameFromUrl = (url: string) => {
    try {
      const clean = url.split("?")[0];
      const parts = clean.split("/");
      return parts[parts.length - 1] || clean;
    } catch {
      return url;
    }
  };

  const ExportAttachmentsBlock = () => {
    return (
      <div style={sectionStyle}>
        <Title level={5} style={{ marginBottom: 15, textAlign: "center", color: "#0f172a" }}>
          ATTACHMENTS
        </Title>

        {attachmentItems.length === 0 ? (
          <Text type="secondary">No attachments</Text>
        ) : (
          <Row gutter={rowGutter}>
            {attachmentItems.map((att) => {
              const fullUrl = `${api.baseUrl}${att.url}`;
              const proxiedUrl = `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
              const isPdf = isPdfUrl(att.url);
              const fileName = fileNameFromUrl(att.url);
              return (
                <Col key={att.key} span={12}>
                  <div style={{ border: `1px solid ${borderColor}`, borderRadius: 4, padding: 10 }}>
                    <div style={labelRowStyle}>
                      <Text style={labelStyle}>{att.title}</Text>
                      <Text style={{ fontSize: 12, color: "#0f172a" }}>{fileName}</Text>
                    </div>

                    {isPdf ? (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        PDF
                      </Text>
                    ) : (
                      <img
                        src={proxiedUrl}
                        alt={att.title}
                        style={{ width: "100%", height: "auto", marginTop: 8, borderRadius: 4, border: `1px solid ${borderColor}` }}
                      />
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    );
  };

  const attachmentItems: Array<{ key: string; title: string; url: string }> = [
    { key: "avatar", title: "PHOTO", url: employee.avatar_url || "" },
    { key: "cnic", title: "CNIC", url: employee.cnic_attachment || "" },
    { key: "domicile", title: "DOMICILE", url: employee.domicile_attachment || "" },
    { key: "sho_verified", title: "SHO VERIFICATION", url: employee.sho_verified_attachment || "" },
    { key: "ssp_verified", title: "SSP VERIFICATION", url: employee.ssp_verified_attachment || "" },
    { key: "khidmat_verified", title: "KHIDMAT MARKAZ VERIFICATION", url: employee.khidmat_verified_attachment || "" },
    { key: "police_trg", title: "POLICE TRAINING", url: employee.police_trg_attachment || "" },
    { key: "served_in", title: "SERVED IN CERTIFICATE", url: employee.served_in_attachment || "" },
    { key: "experience_security", title: "EXPERIENCE (SECURITY)", url: employee.experience_security_attachment || "" },
    { key: "vaccination", title: "VACCINATION", url: employee.vaccination_attachment || "" },
    { key: "photo_on_doc", title: "PHOTO ON DOC", url: employee.photo_on_doc_attachment || "" },
    { key: "personal_signature", title: "PERSONAL SIGNATURE", url: employee.personal_signature_attachment || "" },
    { key: "recording_officer_signature", title: "RECORDING OFFICER SIGNATURE", url: employee.recording_officer_signature_attachment || "" },
    { key: "fingerprint_thumb", title: "FINGERPRINT THUMB", url: employee.fingerprint_thumb_attachment || "" },
    { key: "fingerprint_index", title: "FINGERPRINT INDEX", url: employee.fingerprint_index_attachment || "" },
    { key: "fingerprint_middle", title: "FINGERPRINT MIDDLE", url: employee.fingerprint_middle_attachment || "" },
    { key: "fingerprint_ring", title: "FINGERPRINT RING", url: employee.fingerprint_ring_attachment || "" },
    { key: "fingerprint_pinky", title: "FINGERPRINT PINKY", url: employee.fingerprint_pinky_attachment || "" },
    { key: "employment_agreement", title: "EMPLOYMENT AGREEMENT", url: employee.employment_agreement_attachment || "" },
    { key: "education", title: "EDUCATION", url: employee.education_attachment || "" },
    { key: "nok_cnic", title: "NOK CNIC", url: employee.nok_cnic_attachment || "" },
    { key: "other_documents", title: "OTHER DOCUMENTS", url: employee.other_documents_attachment || "" },
  ]
    .filter((x) => x.url && x.url.trim())
    .map((x) => ({ ...x, url: x.url }));

  const FieldLabel = ({ text, attachmentUrl }: { text: string; attachmentUrl?: string | null }) => {
    return (
      <div style={labelRowStyle}>
        <Text style={labelStyle}>{text}</Text>
        {attachmentUrl ? (
          <Button
            size="small"
            type="text"
            icon={<EyeOutlined />}
            onClick={() => openUrl(attachmentUrl)}
            style={{ color: "#1890ff" }}
          />
        ) : null}
      </div>
    );
  };

  const Value = ({ v }: { v: string | null | undefined }) => <Text style={valueStyle}>{val(v)}</Text>;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space align="center">
            <Button className="no-print" icon={<ArrowLeftOutlined />} onClick={() => router.push("/employees2")} style={{ borderRadius: 6 }} />
            <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
              PERSONAL FILE
            </Title>
          </Space>
          <Space>
            <Button onClick={handleExportPdf} icon={<PrinterOutlined />} loading={exportingPdf}>Export PDF</Button>
            <Button onClick={fetchEmployee}>Refresh</Button>
            <Button type="primary" onClick={() => router.push(`/employees2/${employee.id}/edit`)}>
              Edit
            </Button>
          </Space>
        </div>

        <Modal open={photoPreviewOpen} footer={null} onCancel={() => setPhotoPreviewOpen(false)} title="PHOTO" width={520}>
          {employee.avatar_url ? (
            <img
              src={`${api.baseUrl}${employee.avatar_url}`}
              alt="avatar"
              style={{ width: "100%", height: "auto", borderRadius: 8, border: `1px solid ${borderColor}` }}
            />
          ) : (
            <Text type="secondary">No photo</Text>
          )}
        </Modal>

        {/* Visible view content */}
        <div>
        {/* PHOTO + BASIC INFO */}
        <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{ ...sectionStyle, textAlign: "center", padding: 20, cursor: employee.avatar_url ? "pointer" : "default" }}
              onClick={() => employee.avatar_url && setPhotoPreviewOpen(true)}
            >
              <Avatar
                size={80}
                icon={<UserOutlined />}
                src={employee.avatar_url ? `${api.baseUrl}${employee.avatar_url}` : undefined}
                style={{ border: `1px solid ${borderColor}` }}
              />
              <div style={{ marginTop: 8 }}>
                <Text style={labelStyle}>PHOTO</Text>
              </div>
            </div>
          </div>

          <div style={{ flex: 2, ...sectionStyle, padding: 15 }}>
            <Row gutter={rowGutter}>
              <Col span={8}>
                <FieldLabel text="FSS NUMBER" />
                <Value v={employee.fss_no} />
              </Col>
              <Col span={8}>
                <FieldLabel text="INTERVIEWED BY" />
                <Value v={employee.interviewed_by} />
              </Col>
              <Col span={8}>
                <FieldLabel text="INTRODUCED BY" />
                <Value v={employee.introduced_by} />
              </Col>
              <Col span={8}>
                <FieldLabel text="DEPLOYED AT" />
                <Value v={employee.deployed_at || employee.deployment_details} />
              </Col>
              <Col span={8}>
                <FieldLabel text="ENROLLED AS" />
                <Value v={employee.enrolled_as} />
              </Col>
              <Col span={8}>
                <FieldLabel text="PAY (RS)" />
                <Value v={employee.salary} />
              </Col>
              <Col span={8}>
                <FieldLabel text="BDM" />
                <Value v={employee.bdm_name} />
              </Col>
            </Row>
          </div>
        </div>

        {/* STATUS */}
        <div style={sectionStyle}>
          <Row gutter={rowGutter}>
            <Col span={6}>
              <FieldLabel text="STATUS" />
              <Value v={employee.status} />
            </Col>
            <Col span={6}>
              <FieldLabel text="SERVED IN" attachmentUrl={employee.served_in_attachment} />
              <Value v={employee.served_in} />
            </Col>
            <Col span={6}>
              <FieldLabel text="EXPERIENCE IN SECURITY COMPANY" attachmentUrl={employee.experience_security_attachment} />
              <Value v={employee.experience_security} />
            </Col>
            <Col span={6}>
              <FieldLabel text="ORIGINAL DOCUMENT HELD" />
              <Value v={employee.documents_held} />
            </Col>
          </Row>
          <Row gutter={rowGutter} style={{ marginTop: 12 }}>
            <Col span={6}>
              <FieldLabel text="AGREEMENT DATE" attachmentUrl={employee.employment_agreement_attachment} />
              <Value v={employee.employment_agreement_date} />
            </Col>
            <Col span={6}>
              <FieldLabel text="OTHER DOCUMENTS" attachmentUrl={employee.other_documents_attachment} />
              <Value v={employee.documents_held} />
            </Col>
            <Col span={6}>
              <FieldLabel text="UNIT" />
              <Value v={employee.unit} />
            </Col>
            <Col span={6}>
              <FieldLabel text="RANK" />
              <Value v={employee.rank} />
            </Col>
          </Row>
          <Row gutter={rowGutter} style={{ marginTop: 12 }}>
            <Col span={6}>
              <FieldLabel text="DATE OF ENROLMENT" />
              <Value v={employee.enrolled} />
            </Col>
            <Col span={6}>
              <FieldLabel text="DATE OF RE-ENROLMENT" />
              <Value v={employee.re_enrolled} />
            </Col>
          </Row>
        </div>

        {/* BIO DATA */}
        <div style={sectionStyle}>
          <Title level={5} style={{ marginBottom: 15, textAlign: "center" }}>
            BIO DATA
          </Title>
          <Row gutter={rowGutter}>
            <Col span={6}>
              <FieldLabel text="NAME" />
              <Value v={employee.name} />
            </Col>
            <Col span={6}>
              <FieldLabel text="BLOOD GROUP" />
              <Value v={employee.blood_group} />
            </Col>
            <Col span={6}>
              <FieldLabel text="FATHER NAME" />
              <Value v={employee.father_name} />
            </Col>
            <Col span={6}>
              <FieldLabel text="CNIC NO" attachmentUrl={employee.cnic_attachment} />
              <Value v={employee.cnic} />
            </Col>
            <Col span={6}>
              <FieldLabel text="DATE OF EXPIRY" />
              <Value v={employee.cnic_expiry} />
            </Col>
            <Col span={6}>
              <FieldLabel text="DATE OF BIRTH" />
              <Value v={employee.dob} />
            </Col>
            <Col span={6}>
              <FieldLabel text="HEIGHT" />
              <Value v={employee.height} />
            </Col>
            <Col span={6}>
              <FieldLabel text="EDUCATION" attachmentUrl={employee.education_attachment} />
              <Value v={employee.education} />
            </Col>
            <Col span={6}>
              <FieldLabel text="MED CAT" />
              <Value v={employee.medical_category} />
            </Col>
            <Col span={6}>
              <FieldLabel text="CAUSE OF DISCH" />
              <Value v={employee.medical_discharge_cause} />
            </Col>
            <Col span={6}>
              <FieldLabel text="PERSONAL USING MOBILE NO" />
              <Value v={employee.personal_mobile || employee.mobile_no} />
            </Col>
          </Row>
        </div>

        {/* PERMANENT/PRESENT ADDRESS */}
        <div style={sectionStyle}>
          <Title level={5} style={{ marginBottom: 15, textAlign: "center" }}>
            PERMANENT/PRESENT ADDRESS
          </Title>
          <Row gutter={rowGutter}>
            <Col span={12} style={{ borderRight: `1px solid ${borderColor}`, paddingRight: 16 }}>
              <FieldLabel text="PERMANENT ADDRESS" />
              <Row gutter={rowGutter} style={{ marginTop: 8 }}>
                <Col span={8}>
                  <FieldLabel text="VILLAGE" />
                  <Value v={employee.village} />
                </Col>
                <Col span={8}>
                  <FieldLabel text="POST OFFICE" />
                  <Value v={employee.post_office} />
                </Col>
                <Col span={8}>
                  <FieldLabel text="THANA" />
                  <Value v={employee.thana} />
                </Col>
                <Col span={12}>
                  <FieldLabel text="TEHSIL" />
                  <Value v={employee.tehsil} />
                </Col>
                <Col span={12}>
                  <FieldLabel text="DISTRICT" />
                  <Value v={employee.district} />
                </Col>
              </Row>
            </Col>
            <Col span={12} style={{ paddingLeft: 16 }}>
              <FieldLabel text="PRESENT" />
              <Row gutter={rowGutter} style={{ marginTop: 8 }}>
                <Col span={8}>
                  <FieldLabel text="VILLAGE" />
                  <Value v={employee.temp_village} />
                </Col>
                <Col span={8}>
                  <FieldLabel text="POST OFFICE" />
                  <Value v={employee.temp_post_office} />
                </Col>
                <Col span={8}>
                  <FieldLabel text="THANA" />
                  <Value v={employee.temp_thana} />
                </Col>
                <Col span={12}>
                  <FieldLabel text="TEHSIL" />
                  <Value v={employee.temp_tehsil} />
                </Col>
                <Col span={12}>
                  <FieldLabel text="DISTRICT" />
                  <Value v={employee.temp_district} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        {/* FAMILY INFORMATION */}
        <div style={sectionStyle}>
          <Title level={5} style={{ marginBottom: 15, textAlign: "center" }}>
            FAMILY INFORMATION
          </Title>
          <Row gutter={rowGutter}>
            <Col span={6}>
              <FieldLabel text="SONS" />
              <Value v={employee.sons_count} />
            </Col>
            <Col span={6}>
              <FieldLabel text="DAUGHTERS" />
              <Value v={employee.daughters_count} />
            </Col>
            <Col span={6}>
              <FieldLabel text="BROTHERS" />
              <Value v={employee.brothers_count} />
            </Col>
            <Col span={6}>
              <FieldLabel text="SISTERS" />
              <Value v={employee.sisters_count} />
            </Col>
            <Col span={8}>
              <FieldLabel text="NAME OF NOK" />
              <Value v={employee.nok_name} />
            </Col>
            <Col span={6}>
              <FieldLabel text="NOK CNIC NO" attachmentUrl={employee.nok_cnic_attachment} />
              <Value v={employee.nok_cnic} />
            </Col>
            <Col span={6}>
              <FieldLabel text="MOBILE NO" />
              <Value v={employee.nok_mobile} />
            </Col>
          </Row>
        </div>

        {/* VERIFICATION */}
        <div style={sectionStyle}>
          <Row gutter={rowGutter}>
            <Col span={6}>
              <FieldLabel text="PARTICULARS VERIFIED BY SHO ON" attachmentUrl={employee.sho_verified_attachment} />
              <Value v={employee.verified_by_sho} />
            </Col>
            <Col span={6}>
              <FieldLabel text="PARTICULARS VERIFIED BY SSP ON" attachmentUrl={employee.ssp_verified_attachment} />
              <Value v={employee.verified_by_ssp} />
            </Col>
            <Col span={6}>
              <FieldLabel text="SIGNATURE OF RECORDING OFFICER" attachmentUrl={employee.recording_officer_signature_attachment} />
              <Value v={employee.recording_officer_signature} />
            </Col>
            <Col span={6}>
              <FieldLabel text="SIGNATURE OF INDIVIDUAL" attachmentUrl={employee.personal_signature_attachment} />
              <Value v={employee.individual_signature} />
            </Col>
          </Row>
        </div>

        {/* FINGER IMPRESSION */}
        <div style={sectionStyle}>
          <Title level={5} style={{ marginBottom: 15, textAlign: "center" }}>
            FINGER IMPRESSION
          </Title>
          <Row gutter={tightRowGutter}>
            <Col span={4}>
              <FieldLabel text="LITTLE" attachmentUrl={employee.fingerprint_pinky_attachment} />
            </Col>
            <Col span={4}>
              <FieldLabel text="RING" attachmentUrl={employee.fingerprint_ring_attachment} />
            </Col>
            <Col span={4}>
              <FieldLabel text="MIDDLE" attachmentUrl={employee.fingerprint_middle_attachment} />
            </Col>
            <Col span={4}>
              <FieldLabel text="INDEX" attachmentUrl={employee.fingerprint_index_attachment} />
            </Col>
            <Col span={4}>
              <FieldLabel text="THUMB" attachmentUrl={employee.fingerprint_thumb_attachment} />
            </Col>
            <Col span={4}>
              <FieldLabel text="SIGNATURE" attachmentUrl={employee.personal_signature_attachment} />
            </Col>
          </Row>
        </div>

        </div>

        {/* Hidden export-only content (used for PDF capture) */}
        <div
          id="employees2-profile-pdf-export"
          style={{
            position: "fixed",
            left: -10000,
            top: 0,
            width: 950,
            background: "#ffffff",
            padding: "24px 28px",
            color: "#0f172a",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, paddingTop: 6 }}>
            <img src="/logo-removebg-preview.png" alt="ERP" style={{ height: 64, width: "auto" }} />
          </div>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <Title level={4} style={{ margin: 0, color: "#0f172a" }}>
              PERSONAL FILE
            </Title>
            <Text style={{ color: "#0f172a" }}>{employee?.name || ""}</Text>
          </div>

          {/* Re-use the live view content for export by cloning markup via HTML */}
          <div style={{ color: "#0f172a" }}>
            <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...sectionStyle, textAlign: "center", padding: 20 }}>
                  {employee.avatar_url ? (
                    <img
                      src={`/api/proxy?url=${encodeURIComponent(`${api.baseUrl}${employee.avatar_url}`)}`}
                      alt="PHOTO"
                      crossOrigin="anonymous"
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%", border: `1px solid ${borderColor}` }}
                    />
                  ) : (
                    <Avatar size={80} icon={<UserOutlined />} style={{ border: `1px solid ${borderColor}` }} />
                  )}
                  <div style={{ marginTop: 8 }}>
                    <Text style={labelStyle}>PHOTO</Text>
                  </div>
                </div>
              </div>

              <div style={{ flex: 2, ...sectionStyle, padding: 15 }}>
                <Row gutter={rowGutter}>
                  <Col span={8}>
                    <FieldLabel text="FSS NUMBER" />
                    <Value v={employee.fss_no} />
                  </Col>
                  <Col span={8}>
                    <FieldLabel text="INTERVIEWED BY" />
                    <Value v={employee.interviewed_by} />
                  </Col>
                  <Col span={8}>
                    <FieldLabel text="INTRODUCED BY" />
                    <Value v={employee.introduced_by} />
                  </Col>
                  <Col span={8}>
                    <FieldLabel text="DEPLOYED AT" />
                    <Value v={employee.deployed_at || employee.deployment_details} />
                  </Col>
                  <Col span={8}>
                    <FieldLabel text="ENROLLED AS" />
                    <Value v={employee.enrolled_as} />
                  </Col>
                  <Col span={8}>
                    <FieldLabel text="PAY (RS)" />
                    <Value v={employee.salary} />
                  </Col>
                  <Col span={8}>
                    <FieldLabel text="BDM" />
                    <Value v={employee.bdm_name} />
                  </Col>
                </Row>
              </div>
            </div>

            <div style={sectionStyle}>
              <Row gutter={rowGutter}>
                <Col span={6}>
                  <FieldLabel text="STATUS" />
                  <Value v={employee.status} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="SERVED IN" />
                  <Value v={employee.served_in} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="EXPERIENCE IN SECURITY COMPANY" />
                  <Value v={employee.experience_security} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="ORIGINAL DOCUMENT HELD" />
                  <Value v={employee.documents_held} />
                </Col>
              </Row>
              <Row gutter={rowGutter} style={{ marginTop: 12 }}>
                <Col span={6}>
                  <FieldLabel text="AGREEMENT DATE" />
                  <Value v={employee.employment_agreement_date} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="OTHER DOCUMENTS" />
                  <Value v={employee.documents_held} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="UNIT" />
                  <Value v={employee.unit} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="RANK" />
                  <Value v={employee.rank} />
                </Col>
              </Row>
              <Row gutter={rowGutter} style={{ marginTop: 12 }}>
                <Col span={6}>
                  <FieldLabel text="DATE OF ENROLMENT" />
                  <Value v={employee.enrolled} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="DATE OF RE-ENROLMENT" />
                  <Value v={employee.re_enrolled} />
                </Col>
              </Row>
            </div>

            <div style={sectionStyle}>
              <Title level={5} style={{ marginBottom: 15, textAlign: "center", color: "#0f172a" }}>
                BIO DATA
              </Title>
              <Row gutter={rowGutter}>
                <Col span={6}>
                  <FieldLabel text="NAME" />
                  <Value v={employee.name} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="BLOOD GROUP" />
                  <Value v={employee.blood_group} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="FATHER NAME" />
                  <Value v={employee.father_name} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="CNIC NO" />
                  <Value v={employee.cnic} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="DATE OF EXPIRY" />
                  <Value v={employee.cnic_expiry} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="DATE OF BIRTH" />
                  <Value v={employee.dob} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="HEIGHT" />
                  <Value v={employee.height} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="EDUCATION" />
                  <Value v={employee.education} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="MED CAT" />
                  <Value v={employee.medical_category} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="CAUSE OF DISCH" />
                  <Value v={employee.medical_discharge_cause} />
                </Col>
                <Col span={6}>
                  <FieldLabel text="PERSONAL USING MOBILE NO" />
                  <Value v={employee.personal_mobile || employee.mobile_no} />
                </Col>
              </Row>
            </div>

            <div style={sectionStyle}>
              <Title level={5} style={{ marginBottom: 15, textAlign: "center", color: "#0f172a" }}>
                PERMANENT/PRESENT ADDRESS
              </Title>
              <Row gutter={rowGutter}>
                <Col span={12} style={{ borderRight: `1px solid ${borderColor}`, paddingRight: 16 }}>
                  <Text style={labelStyle}>PERMANENT ADDRESS</Text>
                  <Row gutter={rowGutter} style={{ marginTop: 8 }}>
                    <Col span={8}>
                      <Text style={labelStyle}>VILLAGE</Text>
                      <Value v={employee.village} />
                    </Col>
                    <Col span={8}>
                      <Text style={labelStyle}>POST OFFICE</Text>
                      <Value v={employee.post_office} />
                    </Col>
                    <Col span={8}>
                      <Text style={labelStyle}>THANA</Text>
                      <Value v={employee.thana} />
                    </Col>
                    <Col span={12}>
                      <Text style={labelStyle}>TEHSIL</Text>
                      <Value v={employee.tehsil} />
                    </Col>
                    <Col span={12}>
                      <Text style={labelStyle}>DISTRICT</Text>
                      <Value v={employee.district} />
                    </Col>
                  </Row>
                </Col>
                <Col span={12} style={{ paddingLeft: 16 }}>
                  <Text style={labelStyle}>PRESENT</Text>
                  <Row gutter={rowGutter} style={{ marginTop: 8 }}>
                    <Col span={8}>
                      <Text style={labelStyle}>VILLAGE</Text>
                      <Value v={employee.temp_village} />
                    </Col>
                    <Col span={8}>
                      <Text style={labelStyle}>POST OFFICE</Text>
                      <Value v={employee.temp_post_office} />
                    </Col>
                    <Col span={8}>
                      <Text style={labelStyle}>THANA</Text>
                      <Value v={employee.temp_thana} />
                    </Col>
                    <Col span={12}>
                      <Text style={labelStyle}>TEHSIL</Text>
                      <Value v={employee.temp_tehsil} />
                    </Col>
                    <Col span={12}>
                      <Text style={labelStyle}>DISTRICT</Text>
                      <Value v={employee.temp_district} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            <div style={sectionStyle}>
              <Title level={5} style={{ marginBottom: 15, textAlign: "center", color: "#0f172a" }}>
                FAMILY INFORMATION
              </Title>
              <Row gutter={rowGutter}>
                <Col span={6}>
                  <Text style={labelStyle}>SONS</Text>
                  <Value v={employee.sons_count} />
                </Col>
                <Col span={6}>
                  <Text style={labelStyle}>DAUGHTERS</Text>
                  <Value v={employee.daughters_count} />
                </Col>
                <Col span={6}>
                  <Text style={labelStyle}>BROTHERS</Text>
                  <Value v={employee.brothers_count} />
                </Col>
                <Col span={6}>
                  <Text style={labelStyle}>SISTERS</Text>
                  <Value v={employee.sisters_count} />
                </Col>
                <Col span={8}>
                  <Text style={labelStyle}>NAME OF NOK</Text>
                  <Value v={employee.nok_name} />
                </Col>
                <Col span={6}>
                  <Text style={labelStyle}>NOK CNIC NO</Text>
                  <Value v={employee.nok_cnic} />
                </Col>
                <Col span={6}>
                  <Text style={labelStyle}>MOBILE NO</Text>
                  <Value v={employee.nok_mobile} />
                </Col>
              </Row>
            </div>

            <div style={sectionStyle}>
              <Row gutter={rowGutter}>
                <Col span={6}>
                  <Text style={labelStyle}>PARTICULARS VERIFIED BY SHO ON</Text>
                  <Value v={employee.verified_by_sho} />
                </Col>
                <Col span={6}>
                  <Text style={labelStyle}>PARTICULARS VERIFIED BY SSP ON</Text>
                  <Value v={employee.verified_by_ssp} />
                </Col>
                <Col span={6}>
                  <Text style={labelStyle}>SIGNATURE OF RECORDING OFFICER</Text>
                  <Value v={employee.recording_officer_signature} />
                </Col>
                <Col span={6}>
                  <Text style={labelStyle}>SIGNATURE OF INDIVIDUAL</Text>
                  <Value v={employee.individual_signature} />
                </Col>
              </Row>
            </div>

            <div style={sectionStyle}>
              <Title level={5} style={{ marginBottom: 15, textAlign: "center", color: "#0f172a" }}>
                FINGER IMPRESSION
              </Title>
              <Row gutter={tightRowGutter}>
                <Col span={4}>
                  <Text style={labelStyle}>LITTLE</Text>
                </Col>
                <Col span={4}>
                  <Text style={labelStyle}>RING</Text>
                </Col>
                <Col span={4}>
                  <Text style={labelStyle}>MIDDLE</Text>
                </Col>
                <Col span={4}>
                  <Text style={labelStyle}>INDEX</Text>
                </Col>
                <Col span={4}>
                  <Text style={labelStyle}>THUMB</Text>
                </Col>
                <Col span={4}>
                  <Text style={labelStyle}>SIGNATURE</Text>
                </Col>
              </Row>
            </div>

            {exportAttachmentsVisible ? <ExportAttachmentsBlock /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
