import { useState, useRef, useEffect } from "react";
import {
  FiMoreVertical,
  FiEdit,
  FiHeart,
  FiCopy,
  FiShare2,
  FiLink,
  FiSave,
  FiDownload,
  FiUpload,
  FiMail,
  FiCalendar,
  FiActivity,
  FiArchive,
  FiTrash,
  FiGrid,
  FiPlus,
} from "react-icons/fi";

const ProjectDropdown = ({ count, projectName: initialName }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState(initialName);
  const [dropUp, setDropUp] = useState(false); // ✅ mở lên hay xuống
  const buttonRef = useRef(null);

  // ✅ Kiểm tra vị trí để quyết định direction
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Nếu không đủ chỗ bên dưới mà phía trên còn trống thì mở lên
      setDropUp(spaceBelow < 300 && spaceAbove > 300);
    }
  }, [isOpen]);

  // Hành động ví dụ
  const handleEdit = () => {
    const newName = prompt("Edit project name:", projectName);
    if (newName) setProjectName(newName);
  };
  const handleDuplicate = () => alert(`Duplicated project "${projectName}"`);
  const handleDelete = () => {
    if (confirm(`Delete project "${projectName}"?`)) {
      alert("Deleted!");
    }
  };

  return (
    <li
      className="group flex items-center text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out rounded px-2 py-1 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsOpen(false);
      }}
    >
      <span className="mr-2">#</span> {projectName}

      {!isHovered ? (
        <span className="ml-auto text-gray-400 text-sm">{count}</span>
      ) : (
        <div className="ml-auto group-hover:flex hidden relative items-center">
          <button
            ref={buttonRef}
            className="text-gray-600 hover:text-black text-lg px-2 font-bold"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <FiMoreVertical />
          </button>

          {/* Tooltip */}
          <div className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2 px-2 py-1 bg-black text-white text-xs rounded shadow-md whitespace-nowrap z-50">
            More actions
          </div>

          {/* Dropdown menu */}
          {isOpen && (
            <div
              className={`absolute left-full ml-2 ${
                dropUp ? "bottom-0 translate-y-full" : "top-0"
              } w-64 bg-white border rounded shadow-lg z-50 text-sm py-2 max-h-[400px] overflow-y-auto`}
            >
              <MenuItem icon={<FiEdit />} label="Edit" onClick={handleEdit} />
              <MenuItem icon={<FiHeart />} label="Add to favorites" />
              <MenuItem icon={<FiCopy />} label="Duplicate" onClick={handleDuplicate} />
              <MenuItem icon={<FiShare2 />} label="Share" />
              <MenuItem icon={<FiLink />} label="Copy link to project" />
              <MenuItem icon={<FiSave />} label="Save as template" />
              <MenuItem icon={<FiGrid />} label="Browse templates" />
              <MenuItem icon={<FiDownload />} label="Import from CSV" />
              <MenuItem icon={<FiUpload />} label="Export as CSV" />
              <MenuItem icon={<FiMail />} label="Email tasks to this project" />
              <MenuItem icon={<FiCalendar />} label="Project calendar feed" />
              <MenuItem icon={<FiActivity />} label="Activity log" />
              <MenuItem icon={<FiPlus />} label="Add extension..." />
              <MenuItem icon={<FiArchive />} label="Archive" />
              <MenuItem
                icon={<FiTrash />}
                label="Delete"
                onClick={handleDelete}
                className="text-red-500 hover:bg-red-100"
              />
            </div>
          )}
        </div>
      )}
    </li>
  );
};

const MenuItem = ({ icon, label, onClick = () => {}, className = "" }) => (
  <button
    className={`flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700 ${className}`}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    <span className="mr-3 text-lg">{icon}</span>
    {label}
  </button>
);

export default ProjectDropdown;
