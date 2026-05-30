import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { uploadLargeFile, shouldUseChunkedUpload } from "@/lib/chunkUpload";
import type { ChunkUploadResult } from "@/lib/chunkUpload";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
  HardDrive,
} from "lucide-react";

const categories = [
  "自然语言处理",
  "计算机视觉",
  "语音识别",
  "多模态",
  "强化学习",
  "推荐系统",
  "自动驾驶",
  "其他",
];

const types = [
  { key: "model", label: "AI 模型" },
  { key: "dataset", label: "数据集" },
  { key: "tool", label: "开发工具" },
  { key: "code", label: "开源代码" },
  { key: "doc", label: "文档资料" },
  { key: "tutorial", label: "教程" },
];

type UploadMode = "file" | "link";

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "model" as "model" | "dataset" | "tool" | "doc" | "tutorial",
    category: "自然语言处理",
    tags: "",
    externalUrl: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const createResource = trpc.resource.create.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: "资源发布成功！" });
      setTimeout(() => navigate(`/resource/${data.id}`), 1500);
    },
    onError: (err) => {
      setMessage({ type: "error", text: err.message || "发布失败" });
      setUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      // Max 50GB
      if (selectedFile.size > 50 * 1024 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "文件超过 50GB 上限，请使用「外部链接」方式分享",
        });
        return;
      }
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes > 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
    if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    if (bytes > 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: "error", text: "请先登录后再上传" });
      return;
    }
    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "请输入资源标题" });
      return;
    }

    // Link mode: just save the resource with external URL
    if (uploadMode === "link") {
      if (!formData.externalUrl.trim()) {
        setMessage({ type: "error", text: "请输入外部链接地址" });
        return;
      }
      const descWithUrl = formData.description
        ? `${formData.description}\n\n外部链接: ${formData.externalUrl}`
        : `外部链接: ${formData.externalUrl}`;

      createResource.mutate({
        title: formData.title,
        description: descWithUrl,
        type: formData.type,
        category: formData.category,
        tags: formData.tags || undefined,
        isPublic: "public",
      });
      return;
    }

    // File mode
    if (!file) {
      setMessage({ type: "error", text: "请先选择文件" });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage(null);

    let result: ChunkUploadResult | null = null;

    try {
      // Use chunked upload for large files (> 1GB)
      if (shouldUseChunkedUpload(file.size)) {
        result = await uploadLargeFile({
          file,
          onProgress: (uploaded, total, _current) => {
            const pct = Math.round((uploaded / total) * 100);
            setUploadProgress(pct);
          },
        });
      } else {
        // Regular upload for smaller files
        setUploadProgress(10);
        const uploadForm = new FormData();
        uploadForm.append("file", file);

        setUploadProgress(30);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });
        setUploadProgress(80);

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `上传失败 (${res.status})`);
        }

        const data = await res.json();
        if (data.success) {
          result = {
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileSize: data.fileSize,
            key: data.key,
          };
          setUploadProgress(100);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "文件上传失败";
      setMessage({ type: "error", text: msg });
      setUploading(false);
      return;
    }

    if (!result) {
      setMessage({ type: "error", text: "上传未返回文件信息" });
      setUploading(false);
      return;
    }

    // Create resource record
    createResource.mutate({
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type,
      category: formData.category,
      tags: formData.tags || undefined,
      fileUrl: result.fileUrl,
      fileSize: result.fileSize,
      fileName: result.fileName,
      isPublic: "public",
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="glass-card p-8 text-center max-w-md">
          <UploadCloud size={48} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">登录后上传</h2>
          <p className="text-gray-400 text-sm mb-6">请先登录账号，然后分享你的 AI 资源</p>
          <a href="/login" className="btn-primary">去登录</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">分享资源</h1>
        <p className="text-gray-400 text-sm">支持最大 50GB 文件分片上传，也可分享外部链接</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          message.type === "success"
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            : "bg-red-500/10 border border-red-500/20 text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Upload Mode Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
        <button
          onClick={() => { setUploadMode("file"); setMessage(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            uploadMode === "file"
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <HardDrive size={16} />
          上传文件
        </button>
        <button
          onClick={() => { setUploadMode("link"); setMessage(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            uploadMode === "link"
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <LinkIcon size={16} />
          外部链接
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File Upload Area */}
        {uploadMode === "file" && (
          <div className="glass-card p-6">
            <label className="text-sm font-medium text-white mb-3 block">文件上传</label>
            <div
              className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/30 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={24} className="text-blue-400" />
                    <div className="text-left">
                      <div className="text-white text-sm font-medium">{file.name}</div>
                      <div className="text-gray-500 text-xs">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1 rounded-lg hover:bg-white/5 text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <UploadCloud size={36} className="text-gray-600 mx-auto mb-3" />
                  <div className="text-white text-sm font-medium mb-1">点击选择文件</div>
                  <div className="text-gray-500 text-xs mb-2">支持模型文件、数据集、文档等</div>
                  <div className="text-gray-600 text-xs">小于 1GB 直接上传，1GB-50GB 自动分片上传</div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Upload Progress */}
            {uploading && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>上传进度</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* External Link Area */}
        {uploadMode === "link" && (
          <div className="glass-card p-6">
            <label className="text-sm font-medium text-white mb-3 block">
              外部链接 <span className="text-red-400">*</span>
            </label>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-4">
              <p className="text-blue-400/80 text-xs leading-relaxed">
                适用于 HuggingFace、GitHub、百度网盘、Google Drive 等外部托管的大文件。
                在下方粘贴链接地址，社区成员点击即可访问。
              </p>
            </div>
            <input
              type="url"
              value={formData.externalUrl}
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              placeholder="https://huggingface.co/..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        )}

        {/* Resource Info */}
        <div className="glass-card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-1.5 block">
              资源标题 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="给你的资源起个名字"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-1.5 block">资源描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="简要描述资源的内容、用途和特点"
              rows={4}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white mb-1.5 block">资源类型</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
              >
                {types.map((t) => (
                  <option key={t.key} value={t.key} className="bg-[#121218]">{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-1.5 block">领域分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#121218]">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-1.5 block">标签</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="用逗号分隔，如：GPT, PyTorch, 中文"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn-primary w-full py-3 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {uploadMode === "file" ? "上传文件中..." : "发布中..."}
            </>
          ) : (
            <>
              <UploadCloud size={16} />
              {uploadMode === "file" ? "发布资源" : "发布链接"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
