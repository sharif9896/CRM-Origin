type Props = {
  icon: string;
  title: string;
  children: React.ReactNode;
};

const FormSection = ({ icon, title, children }: Props) => (
  <div className="col-span-12">
    <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-5">
      <h2 className="text-lg max-lg:text-[17px] font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i className={`${icon} text-primary`} />
        {title}
      </h2>
      <div className="grid grid-cols-12 gap-4">{children}</div>
    </div>
  </div>
);

export default FormSection;
