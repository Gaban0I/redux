import React from 'react';
import { Link } from 'react-router-dom';
import { switchMode } from '../actions/interface';
import { useDispatch, useSelector } from 'react-redux';

function Banner() {
  const { mode } = useSelector((state) => state.interface);
  const user = useSelector((state) => state.user);
  const basket = useSelector((state) => state.basket);
  const dispatch = useDispatch();

  return (
    <header>
      <h1 style={styles.mainTitle}>
        <Link to="/">EZ Shopping</Link>
      </h1>

      <div style={{ display: 'flex' }}>
        <div style={styles.menuItem}>
          👱‍♂️{' '}
          <Link to="/profile">
            {user.firstname} {user.lastname}
          </Link>
        </div>
        <div style={styles.menuItem}>
          🛒{' '}
          <Link to="/basket">
            <strong>{basket.length}</strong> items
          </Link>
        </div>
        <div style={styles.menuItem}>
          🌓{' '}
          <Link to="#" onClick={changeMode}>
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Link>
        </div>
      </div>
    </header>
  );

  function changeMode() {
    dispatch(switchMode());
  }
}

const styles = {
  menuItem: { margin: '1rem', fontSize: '1.2rem' },
  mainTitle: { fontSize: '2rem', textAlign: 'center', margin: '1rem' },
};

export default Banner;
