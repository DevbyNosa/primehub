import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const tx_ref = searchParams.get('tx_ref');
        const transaction_id = searchParams.get('transaction_id');

        if (!tx_ref) {
          setStatus('failed');
          return;
        }

        const res = await fetch(
          `/api/payment/verify?tx_ref=${tx_ref}&transaction_id=${transaction_id}`,
          { credentials: 'include' }
        );
        const data = await res.json();

        if (data.success) {
          setStatus('success');
          localStorage.removeItem('cart');
          setTimeout(() => navigate('/order-success'), 2000);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('failed');
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying payment...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="text-4xl mb-4">✅</p>
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-gray-500 mt-2">Redirecting to order confirmation...</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <p className="text-4xl mb-4">❌</p>
            <h1 className="text-2xl font-bold">Payment Failed</h1>
            <p className="text-gray-500 mt-2">Please try again</p>
            <button 
              onClick={() => navigate('/checkout')}
              className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Retry Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
}