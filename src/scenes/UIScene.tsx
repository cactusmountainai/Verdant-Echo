import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sellAllItems } from '../state/slices/playerSlice';
import { RootState } from '../state/store';

const UIScene: React.FC = () => {
  const dispatch = useDispatch();
  const playerInventory = useSelector((state: RootState) => state.player.inventory);
  const playerGold = useSelector((state: RootState) => state.player.gold);

  const handleSellAll = () => {
    dispatch(sellAllItems());
  };

  // Define item values for display purposes
  const itemValues: Record<string, number> = {
    'wheat': 5,
    'carrot': 3,
    'potato': 4,
    'corn': 6,
    'tomato': 8,
    'cabbage': 7
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#3a2f1e',
      border: '2px solid #8b4513',
      borderRadius: '8px',
      padding: '16px',
      color: '#fff',
      zIndex: 1000,
      width: '300px'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '12px', color: '#f5e4d3' }}>Sell Booth</h3>
      
      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #6b4a2c',
        borderRadius: '4px',
        marginBottom: '12px',
        backgroundColor: '#4d4030'
      }}>
        {Object.keys(playerInventory).length > 0 ? (
          Object.entries(playerInventory).map(([item, count]) => {
            const value = itemValues[item as keyof typeof itemValues] || 1;
            const totalValue = count * value;
            return (
              <div 
                key={item} 
                style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px',
                  borderBottom: '1px solid #6b4a2c'
                }}
              >
                <span>{item.charAt(0).toUpperCase() + item.slice(1)} ({value}g each):</span>
                <span>{count} = {totalValue}g</span>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '8px', textAlign: 'center' }}>
            Empty inventory
          </div>
        )}
      </div>
      
      <p style={{ marginBottom: '12px', color: '#f5e4d3' }}>Total Gold: {playerGold}</p>
      
      <button 
        onClick={handleSellAll}
        disabled={Object.keys(playerInventory).length === 0}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#8b4513',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: Object.keys(playerInventory).length > 0 ? 'pointer' : 'not-allowed',
          fontWeight: 'bold'
        }}
      >
        Sell All
      </button>
    </div>
  );
};

export default UIScene;
