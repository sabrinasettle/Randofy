// import HistoryContent from "../../_components/HistoryContent/HistoryContent";
//
// new
import HistoryContent from "../../_components/history/HistoryContent";
import { CardLayoutProvider } from "../../context/card-layout-context";
import { HistoryProvider } from "../../context/history-context";
export default function History() {
  return (
    <>
      <HistoryProvider>
        <CardLayoutProvider>
          <HistoryContent />
        </CardLayoutProvider>
      </HistoryProvider>
      {/* <InformationLink /> */}
    </>
  );
}
