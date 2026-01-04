import React, {
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Typography,
  Input,
  Button,
  Space,
  Select
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ScheduleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllpatient } from "../store/patientSlice";
import { patientLists } from "../Services/endpoints";
import "../Styles/billing.css";
const { Title, Text } = Typography;
const { Option } = Select;
const columns = [
  { title: "Patient Name", dataIndex: "patientName" },
  { title: "MRN", dataIndex: "MRC" },
  { title: "Payer (GL)", dataIndex: "payer" },
  { title: "Discharge", dataIndex: "discharge" },
  {
    title: "Status",
    dataIndex: "status",
    render: (status) => {
      const color = status === "discharge" ? "#C96669" : "#33A470";
      return (
        <Tag color="#fff" style={{ backgroundColor: color, padding: "2%" }}>
          {status}
        </Tag>
      );
    }
  }
];

export default function Billing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.patients);
  const [search, setSearch] = useState("");
  const [payerFilter, setPayerFilter] = useState(null);
  const [dischargeFilter, setDischargeFilter] = useState(null);
  const patientList = useMemo(() => {
    return Array.isArray(list) ? list : list?.data || [];
  }, [list]);

  useEffect(() => {
    dispatch(fetchAllpatient(patientLists));
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const searchText = search.toLowerCase();

    return patientList.filter((item) => {
      const matchesSearch =
        item.patientName?.toLowerCase().includes(searchText) ||
        item.MRC?.toLowerCase().includes(searchText);

      const matchesPayer = payerFilter ? item.payer === payerFilter : true;
      const matchesDischarge = dischargeFilter
        ? item.discharge === dischargeFilter
        : true;

      return matchesSearch && matchesPayer && matchesDischarge;
    });
  }, [patientList, search, payerFilter, dischargeFilter]);

  const uniquePayers = useMemo(() => {
    return [...new Set(patientList.map((d) => d.payer).filter(Boolean))];
  }, [patientList]);

  const uniqueDischarges = useMemo(() => {
    return [...new Set(patientList.map((d) => d.discharge).filter(Boolean))];
  }, [patientList]);
  const handleReset = useCallback(() => {
    setSearch("");
    setPayerFilter(null);
    setDischargeFilter(null);
  }, []);

  const handleRowClick = useCallback(
    (record) => ({
      onClick: () =>
        navigate(`/billing/${record.MRC}`, { state: record })
    }),
    [navigate]
  );

  return (
    <div className="billing-page">
      <Title level={2} className="billing-title">
        Billing
      </Title>

      <Row className="stats-wrapper">
        <Col xs={24} sm={12} md={6}>
          <StatCard label="Today's Collection" value="MYR 45,230.00" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard label="Pending Discharges" value="8 Patients" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard label="Draft Proformas" value="12 Bills" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard label="Date Reports" />
        </Col>
      </Row>

      <div
        style={{
          backgroundColor: "#F8F8FA",
          marginRight: "16px",
          marginLeft: "16px",
          border: "1px solid #E5E6EA",
          paddingBottom: "2%"
        }}
      >
        <div className="filter-bar">
          <div>
            <ScheduleOutlined style={{ marginRight: 8, color: "#226aab" }} />
            <Text strong>Active Patient Billing Queue</Text>
          </div>

          <Space wrap>
            <Select
              allowClear
              placeholder="Payer Type"
              className="filter-select"
              value={payerFilter}
              onChange={setPayerFilter}
            >
              {uniquePayers.map((payer) => (
                <Option key={payer} value={payer}>
                  {payer}
                </Option>
              ))}
            </Select>

            <Select
              allowClear
              placeholder="Discharge"
              className="filter-select"
              value={dischargeFilter}
              onChange={setDischargeFilter}
            >
              {uniqueDischarges.map((discharge) => (
                <Option key={discharge} value={discharge}>
                  {discharge}
                </Option>
              ))}
            </Select>

            <Button icon={<FilterOutlined />} onClick={handleReset}>
              Reset
            </Button>
          </Space>
        </div>

        <Input
          className="search-input"
          prefix={<SearchOutlined />}
          placeholder="Search by MRN or Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Table
          className="billing-table"
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={false}
          onRow={handleRowClick}
        />

        <div className="action-bar">
          <Button type="primary" style={{ backgroundColor: "#226aab" }}>
            Quick View
          </Button>
        </div>
      </div>
    </div>
  );
}
function StatCard({ label, value }) {
  return (
    <Card className="stat-card">
      <Text type="secondary">{label}</Text>
      <Title level={4}>{value || "—"}</Title>
    </Card>
  );
}
