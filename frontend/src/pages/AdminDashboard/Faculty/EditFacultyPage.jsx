import AddFacultyPage from "./AddFacultyPage";

export default function EditFacultyPage(props) {
  return (
    <AddFacultyPage
      {...props}
      isEdit={true}
    />
  );
}