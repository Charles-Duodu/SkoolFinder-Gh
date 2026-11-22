import React from 'react';
import { VerificationStatus } from '../../types';
import { Badge } from './Badge';
import { CheckCircle2, Clock, AlertTriangle, XCircle, FileEdit } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case 'approved':
    case 'Approved':
      return (
        <Badge variant="success" className={className}>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Approved / Verified
        </Badge>
      );
    case 'under_review':
    case 'Under Review':
      return (
        <Badge variant="warning" className={className}>
          <Clock className="w-3 h-3 mr-1" />
          Under Review
        </Badge>
      );
    case 'submitted':
    case 'Submitted':
      return (
        <Badge variant="navy" className={className}>
          <Clock className="w-3 h-3 mr-1" />
          Submitted
        </Badge>
      );
    case 'corrections_requested':
    case 'Corrections Requested':
      return (
        <Badge variant="warning" className={className}>
          <AlertTriangle className="w-3 h-3 mr-1" />
          Corrections Requested
        </Badge>
      );
    case 'rejected':
    case 'Rejected':
      return (
        <Badge variant="danger" className={className}>
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    case 'draft':
    case 'Draft':
    default:
      return (
        <Badge variant="outline" className={className}>
          <FileEdit className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      );
  }
};
