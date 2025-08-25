'use client';

import withAuth from '@/lib/withAuth';
import AdminNav from '@/components/AdminNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  File, 
  Trash2, 
  Copy,
  Star,
  StarOff,
  Grid3X3,
  List
} from 'lucide-react';
import { storage, db, auth } from '@/lib/firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import Image from 'next/image';
import { onAuthStateChanged, User } from 'firebase/auth';

interface MediaItem {
  id: string;
  kind: 'image' | 'video' | 'doc';
  filename: string;
  storagePath: string;
  downloadURL: string;
  width?: number;
  height?: number;
  duration?: number;
  createdAt: any;
  createdBy: string;
  tags?: string[];
  isHomepageHero?: boolean;
}

function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dragActive, setDragActive] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadMediaItems();
  }, []);

  const loadMediaItems = async () => {
    try {
      setLoading(true);
      const mediaCollection = collection(db, 'media');
      const q = query(mediaCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const items: MediaItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MediaItem);
      });
      
      setMediaItems(items);
    } catch (error) {
      console.error('Failed to load media:', error);
      toast({
        title: "Error",
        description: "Failed to load media items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!user) return;

    try {
      setUploading(true);
      
      for (const file of Array.from(files)) {
        // Validate file
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          toast({
            title: "File too large",
            description: `${file.name} exceeds 50MB limit`,
            variant: "destructive"
          });
          continue;
        }

        // Determine file kind
        let kind: 'image' | 'video' | 'doc' = 'doc';
        if (file.type.startsWith('image/')) kind = 'image';
        else if (file.type.startsWith('video/')) kind = 'video';

        // Create storage path: uploads/{uid}/{yyyy}/{mm}/filename
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const storagePath = `uploads/${user.uid}/${year}/${month}/${file.name}`;

        // Upload to Firebase Storage
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Get image/video dimensions if possible
        let width: number | undefined;
        let height: number | undefined;
        let duration: number | undefined;

        if (kind === 'image') {
          try {
            const img = new window.Image();
            img.src = downloadURL;
            await new Promise((resolve) => {
              img.onload = () => {
                width = img.naturalWidth;
                height = img.naturalHeight;
                resolve(null);
              };
            });
          } catch (e) {
            // Ignore dimension errors
          }
        }

        // Save metadata to Firestore
        const mediaDoc = {
          kind,
          filename: file.name,
          storagePath,
          downloadURL,
          width,
          height,
          duration,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          tags: [],
          isHomepageHero: false,
        };

        await addDoc(collection(db, 'media'), mediaDoc);
      }

      toast({
        title: "Upload successful",
        description: `${files.length} file(s) uploaded successfully`,
      });

      await loadMediaItems();
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteMediaItem = async (item: MediaItem) => {
    try {
      // Delete from Storage
      const storageRef = ref(storage, item.storagePath);
      await deleteObject(storageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'media', item.id));

      toast({
        title: "Media deleted",
        description: `${item.filename} has been deleted`,
      });

      await loadMediaItems();
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete media item",
        variant: "destructive"
      });
    }
  };

  const toggleHomepageHero = async (item: MediaItem) => {
    try {
      // First, unset any existing homepage hero
      if (!item.isHomepageHero) {
        const currentHero = mediaItems.find(m => m.isHomepageHero);
        if (currentHero) {
          await updateDoc(doc(db, 'media', currentHero.id), {
            isHomepageHero: false
          });
        }
      }

      // Set/unset this item as homepage hero
      await updateDoc(doc(db, 'media', item.id), {
        isHomepageHero: !item.isHomepageHero
      });

      // Update admin settings with homepage hero media ID
      const settingsRef = doc(db, 'admin', 'settings');
      await updateDoc(settingsRef, {
        homepageHeroMediaId: item.isHomepageHero ? null : item.id
      });

      toast({
        title: item.isHomepageHero ? "Removed from homepage" : "Set as homepage hero",
        description: `${item.filename} ${item.isHomepageHero ? 'removed from' : 'set as'} homepage hero`,
      });

      await loadMediaItems();
    } catch (error) {
      console.error('Failed to update homepage hero:', error);
      toast({
        title: "Update failed",
        description: "Failed to update homepage hero setting",
        variant: "destructive"
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "Media URL copied to clipboard",
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const MediaItemCard = ({ item }: { item: MediaItem }) => (
    <Card className={`group relative ${item.isHomepageHero ? 'ring-2 ring-yellow-500' : ''}`}>
      <CardContent className="p-4">
        <div className="aspect-video relative mb-3 rounded-lg overflow-hidden bg-muted">
          {item.kind === 'image' ? (
            <Image 
              src={item.downloadURL} 
              alt={item.filename}
              fill
              className="object-cover"
              onError={() => console.error('Failed to load image:', item.downloadURL)}
            />
          ) : item.kind === 'video' ? (
            <div className="w-full h-full flex items-center justify-center">
              <Video className="w-12 h-12 text-muted-foreground" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <File className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          {item.isHomepageHero && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
              <Star className="w-3 h-3 mr-1" />
              Homepage Hero
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm truncate" title={item.filename}>
            {item.filename}
          </h4>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {item.kind}
            </Badge>
            {item.width && item.height && (
              <Badge variant="outline" className="text-xs">
                {item.width}×{item.height}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyUrl(item.downloadURL)}
              className="flex-1"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleHomepageHero(item)}
              className={item.isHomepageHero ? 'text-yellow-600' : ''}
            >
              {item.isHomepageHero ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteMediaItem(item)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading media library...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <AdminNav />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Media Library</h1>
              <p className="text-muted-foreground">Upload and manage images, videos, and documents</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          </div>

      {/* Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <Upload className={`w-12 h-12 mx-auto ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <h3 className="font-semibold">Upload Media Files</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports images, videos, and documents up to 50MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Media Grid */}
      {mediaItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No media files yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload your first media file to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {mediaItems.map((item) => (
            <MediaItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminMediaPage);