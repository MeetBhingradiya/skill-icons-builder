"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Clipboard, Check, ClipboardX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/mode-toggle";
import { ReactSortable } from "react-sortablejs";
import { availableIcons, IconItem } from "../../lib/icons"; // Import from the new file
import Image from "next/image";


export default function IconBuilder() {
  const { theme, resolvedTheme } = useTheme();
  const selectedTheme = (resolvedTheme || theme) === "dark" ? "light" : "dark";
  const [search, setSearch] = useState("");
  const [selectedIcons, setSelectedIcons] = useState<IconItem[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<IconItem[]>(availableIcons);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isCentered, setIsCentered] = useState(false);
  const [iconsPerLine, setIconsPerLine] = useState(10);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setFilteredIcons(
      availableIcons.filter((icon) => 
        icon.name.toLowerCase().includes(search.toLowerCase()) ||
        icon.id.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    setIsDarkTheme(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const toggleIcon = (icon: IconItem) => {
    setSelectedIcons((prev) =>
      prev.some((i) => i.id === icon.id)
        ? prev.filter((i) => i.id !== icon.id)
        : [...prev, icon]
    );
  };

  const generateUrl = (): string => {
    const baseUrl = "https://skillicons.dev/icons";
    const iconParams = selectedIcons.map(icon => icon.id).join(",");
    const themeParam = isDarkTheme ? "" : "&theme=light";
    const centerParam = isCentered ? "&center=true" : "";
    const perlineParam = iconsPerLine !== 15 ? `&perline=${iconsPerLine}` : "";

    if (iconParams.length === 0) {
      return "No icons selected";
    } else {
      return `${baseUrl}?i=${iconParams}${themeParam}${centerParam}${perlineParam}`;
    }
  };

  const generateMarkdown = () => {
    const url = generateUrl();
    if (url === "No icons selected") {
      return "No icons selected";
    } else {
      return `[![My Skills](${url})](https://skill-icons-builder.vercel.app/)\n\nMy Skills`;
    }
  };

  const generateHtmlCentered = () => {
    const url = generateUrl();
    if (url === "No icons selected") {
      return "No icons selected";
    }
    return `<p align="center">
    <a href="https://skill-icons-builder.vercel.app/">
      <img src="${url}" />
    </a>
  </p>`;
  };

  const handleCopy = (format: "markdown" | "html" | "url") => {
    const textToCopy = format === "markdown" ? generateMarkdown() : format === "html" ? generateHtmlCentered() : generateUrl() || "";
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl mt-10">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 lg:sticky lg:top-10 lg:self-start">
          <div className="mb-6 text-center" id="title">
          <Image
            src={`./Skill-Icons-Builder-Logo-${isDarkTheme ? 'light' : 'dark'}.svg`}
            alt="Skill Icons Builder Logo"
            width={500}
            height={300}
          />
          </div>
          <div className="mb-6 flex gap-2">
            <Input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <ModeToggle></ModeToggle>
          </div>
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <ReactSortable
              list={selectedIcons}
              setList={setSelectedIcons}
              animation={200}
              delay={2}
              className={`flex flex-wrap gap-2 min-h-[48px] ${isCentered && generateUrl() !== "No icons selected" ? "justify-center" : "justify-start"}`}
            >
              {selectedIcons.length > 0 ? (
                selectedIcons.map((icon) => (
                  <div key={icon.id} className="cursor-move">
                    <img
                      src={`https://skillicons.dev/icons?i=${icon.id}&theme=${isDarkTheme ? 'dark' : 'light'}`}
                      alt={icon.name}
                      className="w-12 h-12"
                    />
                  </div>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Select some icons to generate a preview
                </span>
              )}
            </ReactSortable>
          </Card>
          <div className="flex flex-wrap items-center gap-4 mb-6 mt-10">
            <div className="flex items-center gap-2">
              <Switch
                checked={isDarkTheme}
                onCheckedChange={setIsDarkTheme}
                id="theme-toggle"
              />
              <label htmlFor="theme-toggle">Dark Theme</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={isCentered}
                onCheckedChange={setIsCentered}
                id="center-toggle"
              />
              <label htmlFor="center-toggle">Center Icons</label>
            </div>
            <div className="flex items-center gap-2 flex-grow">
              <label htmlFor="icons-per-line">
                Icons per line: {iconsPerLine}
              </label>
              <Slider
                id="icons-per-line"
                min={1}
                max={50}
                step={1}
                value={[iconsPerLine]}
                onValueChange={([value]) => setIconsPerLine(value)}
                className="w-[113px] max-w-xs"
              />
            </div>
          </div>
          <Tabs defaultValue="markdown" className="w-full">
            <TabsList>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
              <TabsTrigger value="html">HTML (Centered)</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="markdown">
              <div className={`flex items-center gap-2 ${generateUrl() === "No icons selected" ? "cursor-not-allowed" : ""}`} >
                <Input value={generateMarkdown()} readOnly className={`${generateUrl() === "No icons selected" ? "gray-500 dark:text-gray-400 text-sm" : ""}`} />
                <Button variant="outline" disabled={generateUrl() === "No icons selected"} size="icon" onClick={() => handleCopy("markdown")}>
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : generateUrl() !== "No icons selected" ? (
                    <Clipboard className="h-4 w-4" />
                  ) : (
                    <ClipboardX className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="html">
              <div className={`flex items-center gap-2 ${generateUrl() === "No icons selected" ? "cursor-not-allowed" : ""}`} >
                <Input value={generateHtmlCentered()} readOnly className={`${generateUrl() === "No icons selected" ? "gray-500 dark:text-gray-400 text-sm" : ""}`} />
                <Button variant="outline" disabled={generateUrl() === "No icons selected"} size="icon" onClick={() => handleCopy("html")}>
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : generateUrl() !== "No icons selected" ? (
                    <Clipboard className="h-4 w-4" />
                  ) : (
                    <ClipboardX className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="url">
              <div className={`flex items-center gap-2 ${generateUrl() === "No icons selected" ? "cursor-not-allowed" : ""}`} >
                <Input value={generateUrl()} readOnly className={`${generateUrl() === "No icons selected" ? "gray-500 dark:text-gray-400 text-sm" : ""}`} />
                <Button variant="outline" disabled={generateUrl() === "No icons selected"} size="icon" onClick={() => handleCopy("url")}>
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : generateUrl() !== "No icons selected" ? (
                    <Clipboard className="h-4 w-4" />
                  ) : (
                    <ClipboardX className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
            {filteredIcons.map((icon) => (
              <Card
                key={icon.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedIcons.some(i => i.id === icon.id) ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => toggleIcon(icon)}
              >
                <img
                  src={`https://skillicons.dev/icons?i=${icon.id}&theme=${selectedTheme}`}
                  alt={icon.name}
                  className="w-12 h-12 mx-auto mb-2"
                />
                <p className="text-center text-sm">{icon.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}