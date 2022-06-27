/* eslint-disable import/no-cycle */
import React, { useEffect } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";
import { useToast } from "../../../contexts/ToastContext";
import { Container } from "./styles";

const icons: any = {
  info: <FiInfo size={28} />,
  error: <FiAlertCircle size={28} />,
  success: <FiCheckCircle size={28} />,
};

function Toast({ toast, style }: any) {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, toast.id]);

  return (
    <Container type={toast.type} style={style}>
      {icons[toast.type] || "info"}

      <div>
        <strong>{toast.title}</strong>
        <p>{toast.description}</p>
      </div>

      <button onClick={() => removeToast(toast.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
}

export default Toast;
