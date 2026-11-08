import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestGet = ({ request }) => affiliateUnavailable(request, 'affiliate_fraud_status');
export const onRequestPost = ({ request }) => affiliateUnavailable(request, 'affiliate_fraud_assessment');
export const onRequestOptions = () => affiliateOptions();
