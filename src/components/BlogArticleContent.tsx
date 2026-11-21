export default function BlogArticleContent({ content }: { content: string }) {
  const paragraphs = content.trim().split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="space-y-5 text-[16px] leading-[2.1] text-ink-700 sm:text-[17px]">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
