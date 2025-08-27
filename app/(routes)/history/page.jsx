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
          <div className="flex flex-col h-full">
            <HistoryContent />
            {/* <footer className="flex justify-between w-full p-6 h-max-min">
              <p className="text-gray-500">Footer Content</p>
            </footer>*/}
          </div>
        </CardLayoutProvider>
      </HistoryProvider>
      {/* <InformationLink /> */}
    </>
  );
}
