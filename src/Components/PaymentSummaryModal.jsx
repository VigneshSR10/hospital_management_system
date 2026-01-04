import React, { useState } from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Tabs,
  Progress,
  Radio,
  Divider,
  message
} from "antd";

const { Text, Title } = Typography;

export default function PaymentSummaryModal({
  open,
  onClose,
  patient,
  item
}) {
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  // ================== Dynamic Calculations ==================
  const qty = item.qty || 0;
  const unitPrice = item.unitPrice || 0;
  const grossAmount = qty * unitPrice;

  const payerCover = item.copay || 0;
  const depositUsed = item.depositUsed || 0;

  const patientPay = grossAmount - payerCover - depositUsed;

  const glLimit = item.glLimit || 0;
  const glUtilized = item.glUtilized || 0;
  const glPercent = glLimit
    ? Math.round((glUtilized / glLimit) * 100)
    : 0;

  const depositAvailable = item.depositAvailable || 0;

  // ================== Payment ==================
  const handlePayment = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      message.success(
        `Paid MYR ${patientPay.toFixed(2)} via ${paymentMode}`
      );
      onClose();
    }, 1500);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      centered
    >
        <Title level={3} className="page-title">Patient Ledger</Title>
      {/* ================= Header ================= */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <img
          src={patient?.avatar}
          alt="avatar"
          style={{ borderRadius: "50%",height:'10%',width:'10%' }}
        />
        <div>
          <Text strong>{patient?.patientName || "—"}</Text>
          <br />
          <Text type="secondary">MRN: {patient?.MRC || "—"}</Text>
        </div>
      </div>

      {/* ================= GL ================= */}
      <Card size="small" style={{ marginTop: 16 }}>
        <Text strong>GL Limit: MYR {glLimit.toFixed(2)}</Text>
        <Progress percent={glPercent} showInfo={false} />
        <Text type="secondary">
          MYR {grossAmount.toFixed(2)} Utilized
        </Text>
      </Card>

      {/* ================= Summary ================= */}
      <Card size="small" style={{ marginTop: 16 }}>
        <p>{item.category}</p>

        <Row justify="space-between">
          <Text>Total Bill</Text>
          <Text strong>MYR {grossAmount.toFixed(2)}</Text>
        </Row>

        <Divider />

        <Row justify="space-between">
          <Text>Payer Cover</Text>
          <Text>MYR {payerCover.toFixed(2)}</Text>
        </Row>

        <Row justify="space-between">
          <Text>Deposit Used</Text>
          <Text>- MYR {depositUsed.toFixed(2)}</Text>
        </Row>

        <Row justify="space-between">
          <Text strong>Patient Pay</Text>
          <Text strong>MYR {patientPay.toFixed(2)}</Text>
        </Row>

        <Row justify="space-between">
          <Text>Deposit Avail</Text>
          <Text>MYR {depositAvailable.toFixed(2)}</Text>
        </Row>
      </Card>

      {/* ================= Payment ================= */}
      <Card size="small" style={{ marginTop: 16 }}>
        <Title level={5}>Select Payment Method</Title>

        <Radio.Group
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          style={{ width: "100%" }}
        >
          <Row gutter={[8, 8]}>
            <Col span={12}><Radio value="CASH">Cash</Radio></Col>
            <Col span={12}><Radio value="CARD">Card</Radio></Col>
            <Col span={12}><Radio value="UPI">UPI</Radio></Col>
            <Col span={12}><Radio value="WALLET">Wallet</Radio></Col>
          </Row>
        </Radio.Group>
      </Card>

      {/* ================= Actions ================= */}
      <Row gutter={8} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Button block>Generate Proforma</Button>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            block
            loading={loading}
            onClick={handlePayment}
          >
            Finalize & Pay
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}
