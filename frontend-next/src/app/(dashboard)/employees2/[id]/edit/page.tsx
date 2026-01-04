"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import {
  Typography,
  Row,
  Col,
  Button,
  Space,
  Spin,
  App,
  Form,
  Input,
  Upload,
  Avatar,
  DatePicker,
  Select,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  PaperClipOutlined,
  CheckCircleOutlined,
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
  eobi_no: string | null;
  insurance: string | null;
  social_security: string | null;
  mobile_no: string | null;
  home_contact: string | null;
  verified_by_sho: string | null;
  verified_by_khidmat_markaz: string | null;
  domicile: string | null;
  verified_by_ssp: string | null;
  deployed_at?: string | null;
  bdm_name?: string | null;
  employment_agreement_date?: string | null;
  personal_mobile?: string | null;
  nok_cnic?: string | null;
  nok_mobile?: string | null;
  recording_officer_signature?: string | null;
  individual_signature?: string | null;
  enrolled: string | null;
  re_enrolled: string | null;
  village: string | null;
  post_office: string | null;
  thana: string | null;
  tehsil: string | null;
  district: string | null;
  permanent_village?: string | null;
  permanent_post_office?: string | null;
  permanent_thana?: string | null;
  permanent_tehsil?: string | null;
  permanent_district?: string | null;
  present_village?: string | null;
  present_post_office?: string | null;
  present_thana?: string | null;
  present_tehsil?: string | null;
  present_district?: string | null;
  duty_location: string | null;
  police_trg_ltr_date: string | null;
  vaccination_cert: string | null;
  vol_no: string | null;
  payments: string | null;
  category: string | null;
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
  bank_accounts: string | null;
  height: string | null;
  education: string | null;
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
  dod: string | null;
  discharge_cause: string | null;
  orig_docs_received: string | null;
}

export default function EditEmployeePage() {
  const { message } = App.useApp();
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState<Employee2 | null>(null);
  const [attachments, setAttachments] = useState<{ [key: string]: File }>({});

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
  const controlStyle: CSSProperties = { width: "100%" };
  const controlTopSpace: CSSProperties = { marginTop: 4 };
  const labelStyle: CSSProperties = { fontSize: 11, fontWeight: 500, color: "#64748b" };
  const labelRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 18,
  };

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Employee2>(`/api/employees2/${params.id}`);
      setEmployee(data);

      const toDayjsOrNull = (v: unknown) => {
        if (typeof v !== "string") return v;
        const s = v.trim();
        if (!s) return null;
        const d = dayjs(s);
        return d.isValid() ? d : null;
      };

      const withDates = {
        ...data,
        employment_agreement_date: toDayjsOrNull(data.employment_agreement_date),
        enrolled: toDayjsOrNull(data.enrolled),
        re_enrolled: toDayjsOrNull(data.re_enrolled),
        cnic_expiry: toDayjsOrNull(data.cnic_expiry),
        dob: toDayjsOrNull(data.dob),
        verified_by_sho: toDayjsOrNull(data.verified_by_sho),
        verified_by_ssp: toDayjsOrNull(data.verified_by_ssp),
        recording_officer_signature: toDayjsOrNull(data.recording_officer_signature),
        individual_signature: toDayjsOrNull(data.individual_signature),
        police_trg_ltr_date: toDayjsOrNull(data.police_trg_ltr_date),
      };

      form.setFieldsValue(withDates);
    } catch {
      message.error("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  }, [params.id, form, message]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      const isRecord = (v: unknown): v is Record<string, unknown> =>
        typeof v === "object" && v !== null && !Array.isArray(v);

      const normalizeDates = (input: unknown): unknown => {
        if (input === null || input === undefined) return input;
        if (Array.isArray(input)) return input.map(normalizeDates);
        if (typeof input === "object") {
          const maybeDayjs = input as { format?: (fmt: string) => string };
          if (typeof maybeDayjs.format === "function") {
            try {
              return maybeDayjs.format("YYYY-MM-DD");
            } catch {
              return input;
            }
          }
          if (!isRecord(input)) return input;
          const out: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(input)) out[k] = normalizeDates(v);
          return out;
        }
        return input;
      };

      const normalizedValues = normalizeDates(values) as Record<string, unknown>;

      await api.put(`/api/employees2/${params.id}`, normalizedValues);

      const uploadPromises = Object.entries(attachments).map(([field, file]) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post(`/api/employees2/${params.id}/upload/${field}`, formData);
      });
      if (uploadPromises.length > 0) await Promise.all(uploadPromises);

      message.success("Employee profile updated successfully");
      router.push(`/employees2/${params.id}`);
    } catch (err: any) {
      console.error("Save error:", err);
      message.error(err?.message || "Failed to update employee. Please check all required fields.");
    } finally {
      setSaving(false);
    }
  };

  const onFileSelect = (field: string, file: File) => {
    setAttachments((prev) => ({ ...prev, [field]: file }));
    return false;
  };

  const AttachmentButton = ({ field }: { field: string }) => {
    const isSelected = !!attachments[field];
    return (
      <Upload beforeUpload={(file) => onFileSelect(field, file)} showUploadList={false}>
        <Button
          icon={isSelected ? <CheckCircleOutlined /> : <PaperClipOutlined />}
          type={isSelected ? "primary" : "default"}
          size="small"
          ghost={isSelected}
        />
      </Upload>
    );
  };

  const FieldLabel = ({ text, attachmentField }: { text: string; attachmentField?: string }) => {
    return (
      <div style={labelRowStyle}>
        <Text style={labelStyle}>{text}</Text>
        {attachmentField ? <AttachmentButton field={attachmentField} /> : null}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", height: "80vh", gap: 16 }}>
        <Spin size="large" />
        <Text type="secondary">Loading Profile Data...</Text>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space align="center">
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.push(`/employees2/${params.id}`)} style={{ borderRadius: 6 }} />
            <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
              PERSONAL FILE
            </Title>
          </Space>
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                setAttachments({});
              }}
            >
              Clear
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
              Save
            </Button>
          </Space>
        </div>

        <Form form={form} layout="vertical" size="small">
          {/* Photo and Basic Info */}
          <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
            {/* Photo */}
            <div style={{ flex: 1 }}>
              <div style={{ ...sectionStyle, textAlign: "center", padding: 20 }}>
                <Upload showUploadList={false} beforeUpload={(file) => onFileSelect("avatar", file)}>
                  <div style={{ cursor: "pointer" }}>
                    <Avatar
                      size={80}
                      icon={<UserOutlined />}
                      src={
                        attachments["avatar"]
                          ? URL.createObjectURL(attachments["avatar"])
                          : employee?.avatar_url
                            ? `${api.baseUrl}${employee.avatar_url}`
                            : null
                      }
                      style={{ border: `1px solid ${borderColor}` }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text style={labelStyle}>PHOTO</Text>
                    </div>
                  </div>
                </Upload>
              </div>
            </div>

            {/* Basic Info Box */}
            <div style={{ flex: 2, ...sectionStyle, padding: 15 }}>
              <Row gutter={rowGutter}>
                <Col span={8}>
                  <FieldLabel text="FSS NUMBER" />
                  <Form.Item name="fss_no">
                    <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <FieldLabel text="INTERVIEWED BY" />
                  <Form.Item name="interviewed_by">
                    <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <FieldLabel text="INTRODUCED BY" />
                  <Form.Item name="introduced_by">
                    <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <FieldLabel text="DEPLOYED AT" />
                  <Form.Item name="deployed_at">
                    <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <FieldLabel text="ENROLLED AS" />
                  <Form.Item name="enrolled_as">
                    <Select style={{ ...controlStyle, ...controlTopSpace }} size="small">
                      <Select.Option value="Supervisor">Supervisor</Select.Option>
                      <Select.Option value="Guard">Guard</Select.Option>
                      <Select.Option value="Driver">Driver</Select.Option>
                      <Select.Option value="Cook">Cook</Select.Option>
                      <Select.Option value="Sweeper">Sweeper</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <FieldLabel text="PAY (RS)" />
                  <Form.Item name="salary">
                    <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <FieldLabel text="BDM" />
                  <Form.Item name="bdm_name">
                    <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>

          {/* Status Box */}
          <div style={sectionStyle}>
            <Row gutter={rowGutter}>
              <Col span={6}>
                <FieldLabel text="STATUS" />
                <Form.Item name="status">
                  <Select style={{ ...controlStyle, ...controlTopSpace }} size="small">
                    <Select.Option value="Army">Army</Select.Option>
                    <Select.Option value="Navy">Navy</Select.Option>
                    <Select.Option value="PAF">PAF</Select.Option>
                    <Select.Option value="Police">Police</Select.Option>
                    <Select.Option value="FC">FC</Select.Option>
                    <Select.Option value="Mjd">Mjd</Select.Option>
                    <Select.Option value="Civ">Civ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="SERVED IN" attachmentField="served_in" />
                <Form.Item name="served_in">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="EXPERIENCE IN SECURITY COMPANY" attachmentField="experience_security" />
                <Form.Item name="experience_security">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="ORIGINAL DOCUMENT HELD" />
                <Form.Item name="original_document_held">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={rowGutter} style={{ marginTop: 12 }}>
              <Col span={6}>
                <FieldLabel text="AGREEMENT DATE" attachmentField="employment_agreement" />
                <Form.Item name="employment_agreement_date">
                  <DatePicker style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="OTHER DOCUMENTS" attachmentField="other_documents" />
                <Form.Item name="documents_held">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={rowGutter} style={{ marginTop: 12 }}>
              <Col span={6}>
                <FieldLabel text="UNIT" />
                <Form.Item name="unit">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="RANK" />
                <Form.Item name="rank">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="DATE OF ENROLMENT" />
                <Form.Item name="enrolled">
                  <DatePicker style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="DATE OF RE-ENROLMENT" />
                <Form.Item name="re_enrolled">
                  <DatePicker style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Bio Data Box */}
          <div style={sectionStyle}>
            <Title level={5} style={{ marginBottom: 15, textAlign: "center" }}>
              BIO DATA
            </Title>
            <Row gutter={rowGutter}>
              <Col span={6}>
                <Text style={labelStyle}>NAME</Text>
                <Form.Item name="name">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text style={labelStyle}>BLOOD GROUP</Text>
                <Form.Item name="blood_group">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text style={labelStyle}>FATHER NAME</Text>
                <Form.Item name="father_name">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="CNIC NO" attachmentField="cnic" />
                <Form.Item name="cnic">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text style={labelStyle}>DATE OF EXPIRY</Text>
                <Form.Item name="cnic_expiry">
                  <DatePicker style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text style={labelStyle}>DATE OF BIRTH</Text>
                <Form.Item name="dob">
                  <DatePicker style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text style={labelStyle}>HEIGHT</Text>
                <Form.Item name="height">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="EDUCATION" attachmentField="education" />
                <Form.Item name="education">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text style={labelStyle}>MED CAT</Text>
                <Form.Item name="medical_category">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text style={labelStyle}>CAUSE OF DISCH</Text>
                <Form.Item name="medical_discharge_cause">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text style={labelStyle}>PERSONAL USING MOBILE NO</Text>
                <Form.Item name="personal_mobile">
                  <Input style={{ ...controlStyle, ...controlTopSpace }} size="small" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Address Box */}
          <div style={sectionStyle}>
            <Title level={5} style={{ marginBottom: 15, textAlign: "center" }}>
              PERMANENT/PRESENT ADDRESS
            </Title>
            <Row gutter={rowGutter}>
              <Col span={12} style={{ borderRight: `1px solid ${borderColor}`, paddingRight: 16 }}>
                <Text style={labelStyle}>PERMANENT ADDRESS</Text>
                <Row gutter={rowGutter} style={{ marginTop: 8 }}>
                  <Col span={8}>
                    <Text style={labelStyle}>VILLAGE</Text>
                    <Form.Item name="permanent_village" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Text style={labelStyle}>POST OFFICE</Text>
                    <Form.Item name="permanent_post_office" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Text style={labelStyle}>THANA</Text>
                    <Form.Item name="permanent_thana" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Text style={labelStyle}>TEHSIL</Text>
                    <Form.Item name="permanent_tehsil" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Text style={labelStyle}>DISTRICT</Text>
                    <Form.Item name="permanent_district" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={12} style={{ paddingLeft: 16 }}>
                <Text style={labelStyle}>PRESENT</Text>
                <Row gutter={rowGutter} style={{ marginTop: 8 }}>
                  <Col span={8}>
                    <Text style={labelStyle}>VILLAGE</Text>
                    <Form.Item name="present_village" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Text style={labelStyle}>POST OFFICE</Text>
                    <Form.Item name="present_post_office" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Text style={labelStyle}>THANA</Text>
                    <Form.Item name="present_thana" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Text style={labelStyle}>TEHSIL</Text>
                    <Form.Item name="present_tehsil" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Text style={labelStyle}>DISTRICT</Text>
                    <Form.Item name="present_district" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          {/* Family Information Box */}
          <div style={sectionStyle}>
            <Title level={5} style={{ marginBottom: 15, textAlign: "center" }}>
              FAMILY INFORMATION
            </Title>
            <Row gutter={rowGutter}>
              <Col span={6}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <Text style={labelStyle}>SONS</Text>
                    <Form.Item name="sons_count" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text style={labelStyle}>DAUGHTERS</Text>
                    <Form.Item name="daughters_count" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <Text style={labelStyle}>BROTHERS</Text>
                    <Form.Item name="brothers_count" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text style={labelStyle}>SISTERS</Text>
                    <Form.Item name="sisters_count" style={{ marginTop: 1 }}>
                      <Input size="small" style={controlStyle} />
                    </Form.Item>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <Text style={labelStyle}>NAME OF NOK</Text>
                <Form.Item name="nok_name" style={{ marginTop: 1 }}>
                  <Input size="small" style={{ maxWidth: 320 }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="NOK CNIC NO" attachmentField="nok_cnic" />
                <Form.Item name="nok_cnic" style={{ marginTop: 1 }}>
                  <Input size="small" style={controlStyle} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text style={labelStyle}>MOBILE NO</Text>
                <Form.Item name="nok_mobile" style={{ marginTop: 1 }}>
                  <Input size="small" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Verification Box */}
          <div style={sectionStyle}>
            <Row gutter={rowGutter}>
              <Col span={6}>
                <FieldLabel text="PARTICULARS VERIFIED BY SHO ON" attachmentField="sho_verified" />
                <Form.Item name="verified_by_sho" style={{ marginTop: 1 }}>
                  <DatePicker style={controlStyle} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="PARTICULARS VERIFIED BY SSP ON" attachmentField="ssp_verified" />
                <Form.Item name="verified_by_ssp" style={{ marginTop: 1 }}>
                  <DatePicker style={controlStyle} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="SIGNATURE OF RECORDING OFFICER" attachmentField="recording_officer_signature" />
                <Form.Item name="recording_officer_signature" style={{ marginTop: 1 }}>
                  <DatePicker style={controlStyle} size="small" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <FieldLabel text="SIGNATURE OF INDIVIDUAL" attachmentField="personal_signature" />
                <Form.Item name="individual_signature" style={{ marginTop: 1 }}>
                  <DatePicker style={controlStyle} size="small" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Fingerprint Box */}
          <div style={sectionStyle}>
            <Title level={5} style={{ marginBottom: 15, textAlign: "center" }}>
              FINGER IMPRESSION
            </Title>
            <Row gutter={tightRowGutter}>
              <Col span={4}>
                <div style={{ ...labelRowStyle, justifyContent: "center" }}>
                  <Text style={labelStyle}>LITTLE</Text>
                </div>
                <div style={{ border: `1px solid ${borderColor}`, padding: 10, marginTop: 4, textAlign: "center" }}>
                  <AttachmentButton field="fingerprint_little" />
                </div>
              </Col>
              <Col span={4}>
                <div style={{ ...labelRowStyle, justifyContent: "center" }}>
                  <Text style={labelStyle}>RING</Text>
                </div>
                <div style={{ border: `1px solid ${borderColor}`, padding: 10, marginTop: 4, textAlign: "center" }}>
                  <AttachmentButton field="fingerprint_ring" />
                </div>
              </Col>
              <Col span={4}>
                <div style={{ ...labelRowStyle, justifyContent: "center" }}>
                  <Text style={labelStyle}>MIDDLE</Text>
                </div>
                <div style={{ border: `1px solid ${borderColor}`, padding: 10, marginTop: 4, textAlign: "center" }}>
                  <AttachmentButton field="fingerprint_middle" />
                </div>
              </Col>
              <Col span={4}>
                <div style={{ ...labelRowStyle, justifyContent: "center" }}>
                  <Text style={labelStyle}>INDEX</Text>
                </div>
                <div style={{ border: `1px solid ${borderColor}`, padding: 10, marginTop: 4, textAlign: "center" }}>
                  <AttachmentButton field="fingerprint_index" />
                </div>
              </Col>
              <Col span={4}>
                <div style={{ ...labelRowStyle, justifyContent: "center" }}>
                  <Text style={labelStyle}>THUMB</Text>
                </div>
                <div style={{ border: `1px solid ${borderColor}`, padding: 10, marginTop: 4, textAlign: "center" }}>
                  <AttachmentButton field="fingerprint_thumb" />
                </div>
              </Col>
              <Col span={4}>
                <div style={{ ...labelRowStyle, justifyContent: "center" }}>
                  <Text style={labelStyle}>SIGNATURE</Text>
                </div>
                <div style={{ border: `1px solid ${borderColor}`, padding: 10, marginTop: 4, textAlign: "center" }}>
                  <AttachmentButton field="signature" />
                </div>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    </div>
  );
}
