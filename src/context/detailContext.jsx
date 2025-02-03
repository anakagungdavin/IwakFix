import { createContext, useState } from "react";

const DetailContext = createContext();

export function DetailProvider({ children }) {
  const [detailData, setDetailData] = useState();

  return (
    <DetailContext.Provider value={{ detailData, setDetailData }}>
      {children}
    </DetailContext.Provider>
  );
}

export default DetailContext;