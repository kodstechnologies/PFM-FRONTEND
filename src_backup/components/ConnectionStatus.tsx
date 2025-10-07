import React, { useState, useEffect } from 'react';
import ConnectionTest from '../utils/connectionTest';

interface ConnectionStatusProps {
  showDetails?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ showDetails = false }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [socketStatus, setSocketStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [isTesting, setIsTesting] = useState(false);
  const [lastTest, setLastTest] = useState<Date | null>(null);

  const connectionTest = new ConnectionTest();

  const testConnections = async () => {
    setIsTesting(true);
    try {
      await connectionTest.testAllConnections();
      
      // Test backend
      const backendResult = await connectionTest.testBackendConnection();
      setBackendStatus(backendResult.success ? 'connected' : 'failed');
      
      // Test socket
      const socketResult = await connectionTest.testSocketConnection();
      setSocketStatus(socketResult.success ? 'connected' : 'failed');
      
      setLastTest(new Date());
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    testConnections();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return '✅';
      case 'failed':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'failed':
        return 'Failed';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'checking':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Connection Status</h3>
        <button
          onClick={testConnections}
          disabled={isTesting}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test'}
        </button>
      </div>

      <div className="space-y-3">
        {/* Backend Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(backendStatus)}</span>
            <span className="text-gray-700">Backend API</span>
          </div>
          <span className={`font-medium ${getStatusColor(backendStatus)}`}>
            {getStatusText(backendStatus)}
          </span>
        </div>

        {/* Socket Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(socketStatus)}</span>
            <span className="text-gray-700">Socket Server</span>
          </div>
          <span className={`font-medium ${getStatusColor(socketStatus)}`}>
            {getStatusText(socketStatus)}
          </span>
        </div>
      </div>

      {lastTest && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last tested: {lastTest.toLocaleTimeString()}
          </p>
        </div>
      )}

      {showDetails && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer hover:text-gray-800">
              Configuration Details
            </summary>
            <div className="mt-2 space-y-1">
              <p>Backend: {connectionTest.getConnectionStatus().backend}</p>
              <p>Socket: {connectionTest.getConnectionStatus().socket}</p>
              <p>Overall: {connectionTest.getConnectionStatus().overall}</p>
            </div>
          </details>
        </div>
      )}

      {/* Overall Status */}
      <div className="mt-4 p-3 rounded-lg bg-gray-50">
        <div className="text-center">
          {backendStatus === 'connected' && socketStatus === 'connected' ? (
            <div className="text-green-600 font-semibold">
              🎉 All systems connected!
            </div>
          ) : (
            <div className="text-yellow-600 font-semibold">
              ⚠️ Some connections need attention
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
