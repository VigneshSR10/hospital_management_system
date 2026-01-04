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
  Typography,
  Tag,
  Button,
  Input,
  Tabs,
  Select,
  Space
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PaymentSummaryModal from "../Components/PaymentSummaryModal.jsx";
import { fetchAllpatient } from "../store/patientSlice";
import { patientLists } from "../Services/endpoints";
import useUIStore from "../store/uiStore.jsx";
import "../Styles/patientLedger.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const statusOptions = [
  "Draft",
  "Active",
  "Billed",
  "Paid",
  "Cancelled",
  "Ordered",
  "Scheduled"
];

const allTabs = ["All", "Pharmacy", "Radiology", "Rehab", "Accommodation"];
const ledgerColumns = [
  { title: "Date", dataIndex: "date" },
  { title: "Item Code", dataIndex: "code" },
  { title: "Description", dataIndex: "desc" },
  {
    title: "Qty",
    dataIndex: "qty",
    render: (qty, row) => `${qty} ${row.unit}`
  },
  { title: "Unit Price", dataIndex: "unitPrice", render: p => `$${p}` },
  { title: "Total", dataIndex: "total", render: p => `$${p}` },
  { title: "Co-Pay", dataIndex: "copay", render: p => `$${p}` },
  { title: "Payer", dataIndex: "payer" },
  {
    title: "Status",
    dataIndex: "status",
    render: status => {
      let color = "blue";
      if (status === "Paid") color = "green";
      else if (status === "Billed") color = "orange";
      else if (status === "Cancelled") color = "red";
      else if (status === "Ordered" || status === "Scheduled")
        color = "purple";

      return (
        <Tag color="#fff" style={{ backgroundColor: color }}>
          {status}
        </Tag>
      );
    }
  }
];

export default function PatientLedger() {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
  paymentModalOpen,
  selectedInvoice,
  openPaymentModal,
  closePaymentModal
} = useUIStore();
  const { list } = useSelector(state => state.patients);
  useEffect(() => {
    if (state?.id) {
      dispatch(fetchAllpatient(`${patientLists}/${state.id}`));
    }
  }, [dispatch, state?.id]);
  const patientData = list?.patientReport || {};
  const ledgerData = useMemo(() => {
    if (!patientData || typeof patientData !== "object") return [];
    const ledger = [];
    Object.entries(patientData).forEach(([category, items]) => {
      if (!Array.isArray(items)) return;
      const normalizedCategory =
        category.charAt(0).toUpperCase() + category.slice(1);
      items.forEach((item, idx) => {
        ledger.push({
          key: item.id || `${category}-${idx}`,
          category: normalizedCategory,
          date: item.date,
          code: item.itemId,
          desc: item.itemName,
          qty: item.qty,
          unit: item.unitType,
          unitPrice: item.unitPrice,
          total: item.qty * item.unitPrice,
          copay: item.coPayAmount,
          payer: item.payer,
          status: item.status
        });
      });
    });

    return ledger;
  }, [patientData]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [itemFilter, setItemFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase();
    return ledgerData.filter(item => {
      const matchesTab =
        activeTab === "All" || item.category === activeTab;
      const matchesSearch =
        item.desc?.toLowerCase().includes(search) ||
        item.code?.toLowerCase().includes(search);

      const matchesItem = itemFilter ? item.desc === itemFilter : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      return (
        matchesTab &&
        matchesSearch &&
        matchesItem &&
        matchesStatus
      );
    });
  }, [
    ledgerData,
    activeTab,
    searchText,
    itemFilter,
    statusFilter
  ]);

  const itemOptions = useMemo(() => {
    if (activeTab === "All") {
      return Object.values(patientData)
        .filter(Array.isArray)
        .flat()
        .map(item => item.itemName);
    }

    return (patientData[activeTab?.toLowerCase()] || []).map(
      item => item.itemName
    );
  }, [activeTab, patientData]);

  const resetFilters = useCallback(() => {
    setItemFilter(null);
    setStatusFilter(null);
    setSearchText("");
  }, []);

  const handleRowClick = useCallback(
    (record) => ({
    onClick: () => {
      openPaymentModal(record);
    },
    style: { cursor: "pointer" }
  }),
  [openPaymentModal]
  );

  return (
    <div
      style={{
        background: "#f9fafb",
        width: "100%",
        minHeight: "100%"
      }}
    >
      <Title level={3} className="page-title">
        Patient Ledger
      </Title>
      <Card
        style={{
          marginBottom: 16,
          marginRight: "16px",
          marginLeft: "16px",
          backgroundColor: "#F6F6F8",
          borderRadius: 0
        }}
      >
        <Row justify="space-between" align="middle">
          <Col
            style={{
              width: "40%",
              paddingTop: "10px",
              paddingBottom: "10px",
              paddingLeft: "10px",
              border: "1px solid #E2E1E6"
            }}
          >
            <Row align="middle" gutter={12}>
              <Col>
                <img
                  src={state?.avatar}
                  alt="avatar"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              </Col>

              <Col>
                <Title level={5} style={{ margin: 0 }}>
                  {state?.patientName || "Ahmed Bin Ali"}
                </Title>

                <Space size={8}>
                  <Text type="secondary">
                    MRN: {state?.MRC || "S4_cres"}
                  </Text>
                  <Text type="secondary">
                    {state?.date || "4 Apr 2008"}
                  </Text>
                </Space>
              </Col>
            </Row>
          </Col>

          <Col>
            <Search
              placeholder="Search by MRN, Name or Contact"
              allowClear
              style={{ width: 280 }}
            />
          </Col>
        </Row>
      </Card>
      <Card style={{ marginRight: "30px", marginLeft: "30px" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{
            background: "#f5f7fa",
            padding: "8px 12px",
            borderRadius: 6
          }}
        >
          <Col flex="auto">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              className="custom-tabs"
              items={allTabs.map(tab => ({
                key: tab,
                label: tab
              }))}
            />
          </Col>

          <Col>
            <Row gutter={8} align="middle">
              <Col>
                <Select
                  allowClear
                  placeholder="Item"
                  style={{ width: 150 }}
                  value={itemFilter}
                  onChange={setItemFilter}
                >
                  {itemOptions.map((name, idx) => (
                    <Option key={idx} value={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col>
                <Select
                  allowClear
                  placeholder="Status"
                  style={{ width: 130 }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                >
                  {statusOptions.map(s => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  style={{ width: 180 }}
                />
              </Col>

              <Col>
                <Button
                  icon={<FilterOutlined />}
                  onClick={resetFilters}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Table
          columns={ledgerColumns}
          dataSource={filteredData}
          pagination={false}
          bordered
          onRow={handleRowClick}
        />
      </Card>

      <PaymentSummaryModal
  open={paymentModalOpen}
  onClose={closePaymentModal}
  patient={state}
  item={selectedInvoice}
/>
    </div>
  );
}
