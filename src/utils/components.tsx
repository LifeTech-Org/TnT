const copyToClipboard = ({
  tntId,
  setCopyStatus,
}: {
  tntId: string;
  setCopyStatus: React.Dispatch<React.SetStateAction<string>>;
}) => {
  navigator.clipboard
    .writeText(tntId)
    .then(() => {
      setCopyStatus("Copied");
    })
    .catch(() => {
      setCopyStatus("Error");
    })
    .finally(() => {
      setTimeout(() => setCopyStatus("Copy"), 3000);
    });
};

const pasteClipboardText = ({
  setTntId,
}: {
  setTntId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  navigator.clipboard.readText().then((clipText) => setTntId(clipText));
};
export { copyToClipboard, pasteClipboardText };
