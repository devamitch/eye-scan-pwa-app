'use client';

import React, { useState } from 'react';
import Dialog from '@/components/base/Dialog';
import { Button } from '@/components/base/buttons';
import { PasswordInput } from '@/components/base/inputs';
import { changePassword } from '@/lib/server/auth';
import useAppStore from '@/store';
import useTranslationData from '@/hooks/use-translation-data';
import styles from './password-change-dialog.module.css';
import { toast } from 'sonner';

interface PasswordChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user, token } = useAppStore((state) => state.auth);
  const { settingsPageText } = useTranslationData();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email || !token) {
      console.log('Authentication error. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(
        {
          email: user.email,
          oldpassword: formData.oldPassword,
          newpassword: formData.newPassword,
        },
        token
      );

      console.log('Password changed successfully');
      toast.success('Password changed successfully');
      handleClose();
    } catch (error: any) {
      toast.error('Password change error:', error);
      console.log('Password change error:', error);
      
      if (error.response?.data?.message) {
        console.log(error.response.data.message);
      } else if (error.message) {
        console.log(error.message);
      } else {
        console.log('Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {settingsPageText.accountSettings.changePassword}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <PasswordInput
            id="oldPassword"
            label={settingsPageText.accountSettings.passwordDialog.currentPassword}
            value={formData.oldPassword}
            onChange={(value: string) => handleInputChange('oldPassword', value)}
            disabled={isLoading}
            required
            autoComplete="current-password"
            showStrength={false}
            error={errors.oldPassword}
          />

          <PasswordInput
            id="newPassword"
            label={settingsPageText.accountSettings.passwordDialog.newPassword}
            value={formData.newPassword}
            onChange={(value: string) => handleInputChange('newPassword', value)}
            disabled={isLoading}
            required
            autoComplete="new-password"
            showStrength={true}
            error={errors.newPassword}
          />

          <PasswordInput
            id="confirmPassword"
            label={settingsPageText.accountSettings.passwordDialog.confirmPassword}
            value={formData.confirmPassword}
            onChange={(value: string) => handleInputChange('confirmPassword', value)}
            disabled={isLoading}
            required
            autoComplete="new-password"
            showStrength={false}
            error={errors.confirmPassword}
          />

          <div className={styles.buttonGroup}>

            <Button
              type="submit"
              variant="primary"
              size="medium"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading 
                ? settingsPageText.accountSettings.passwordDialog.changingText 
                : settingsPageText.accountSettings.passwordDialog.changePasswordButton}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              variant="subtle"
              size="medium"
              fullWidth
              disabled={isLoading}
            >
              {settingsPageText.accountSettings.passwordDialog.cancelButton}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default PasswordChangeDialog;