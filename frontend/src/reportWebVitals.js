import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'; // Certifique-se de que o pacote 'web-vitals' esteja instalado

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
