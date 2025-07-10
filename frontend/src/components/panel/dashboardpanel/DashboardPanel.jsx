import HeaderBar from "./HeaderBar";
import TodayTask from "./TodayTask";
import HoursSpent from "./HoursSpent";
import MyProgress from "./MyProgress";
import SchedulePanel from "./SchedulePanel";
import CalendarMini from "./CalendarMini";
import GoPremium from "./GoPremium";





const DashboardPanel = ({tasks }) => {
  

  return (
    <div className="p-4 overflow-hidden">
      <div className="grid grid-cols-12 gap-6">
        {/* Cột trái */}
        <div className="col-span-8 space-y-6">
          {/* Dòng 1: Header */}
          <HeaderBar />

          {/* Dòng 2: Grid gồm 2 cột (9 + 3) */}
          <div className="grid grid-cols-12 gap-4">
            {/* Cột 1: TodayTask & HoursSpent */}
            <div className="col-span-9 space-y-4">
              <TodayTask tasks={tasks} /> {/* ✅ truyền tasks vào */}
              <HoursSpent />
            </div>

            {/* Cột 2: MyProgress & GoPremium */}
            <div className="col-span-3 h-full flex flex-col justify-between gap-4">
              <MyProgress />
              <GoPremium />
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className="col-span-4 space-y-6">
          <CalendarMini />
          <SchedulePanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
