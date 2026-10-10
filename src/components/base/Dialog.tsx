import React from 'react';
// @ts-expect-error no types available
import Modal from 'react-modal';
import { X } from 'lucide-react';
import styles from './dialog.module.css';
import { ModalProps } from '@/types';


if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

const Dialog : React.FC<ModalProps> = ({ isOpen, onClose, children, footer }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalHeader}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.modalContent}>
        {children}
      </div>

      {footer && (
        <div className={styles.modalFooter}>
          {footer}
        </div>
      )}
    </Modal>
  );
};

export default Dialog;
