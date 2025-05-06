'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// About section types
type TeamMember = {
  id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
};

type AboutContent = {
  heading: string;
  subheading: string;
  mainContent: string;
  mission: string;
  vision: string;
  values: string[];
  storyTitle: string;
  storyContent: string;
  team: TeamMember[];
};

// Mock data
const mockAboutContent: AboutContent = {
  heading: 'About BlingxBeyond',
  subheading: 'Luxury Jewelry for Every Occasion',
  mainContent: 'BlingxBeyond was founded in 2020 with a simple mission - to provide high-quality, beautiful jewelry that makes you feel special. Our collections range from everyday essentials to statement pieces that turn heads.',
  mission: 'To create timeless jewelry pieces that celebrate life\'s special moments and become cherished heirlooms.',
  vision: 'To be recognized globally as a brand synonymous with impeccable craftsmanship, ethical sourcing, and exceptional customer experience.',
  values: [
    'Quality craftsmanship in every piece',
    'Ethical sourcing of all materials',
    'Exceptional customer service',
    'Innovation in design',
    'Sustainability and responsibility'
  ],
  storyTitle: 'Our Journey',
  storyContent: 'BlingxBeyond started as a small home-based business and has grown into a recognized brand in the luxury jewelry market. Our journey has been one of passion, dedication, and continuous improvement. Every piece we create is a testament to our commitment to excellence.',
  team: [
    {
      id: 'team-1',
      name: 'Sarah Johnson',
      position: 'Founder & Creative Director',
      bio: 'Sarah has over 15 years of experience in jewelry design and a passion for creating pieces that tell a story.',
      imageUrl: '/assets/placeholder.jpg'
    },
    {
      id: 'team-2',
      name: 'David Chen',
      position: 'Head of Operations',
      bio: 'David ensures that every BlingxBeyond piece meets our exacting standards of quality and craftsmanship.',
      imageUrl: '/assets/placeholder.jpg'
    },
    {
      id: 'team-3',
      name: 'Priya Patel',
      position: 'Lead Designer',
      bio: 'Priya brings a unique perspective to our designs, combining traditional techniques with modern aesthetics.',
      imageUrl: '/assets/placeholder.jpg'
    }
  ]
};

export default function AboutManagementPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent>(mockAboutContent);
  const [activeTab, setActiveTab] = useState<'overview' | 'story' | 'team'>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Save content changes
  const saveChanges = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would call your API here
      console.log('Saving content:', aboutContent);
      setSaving(false);
      
      // Show success message or notification
      alert('Changes saved successfully!');
    }, 800);
  };

  // Add new value
  const addValue = () => {
    if (newValue.trim() === '') return;
    
    setAboutContent(prev => ({
      ...prev,
      values: [...prev.values, newValue.trim()]
    }));
    
    setNewValue('');
  };

  // Remove value
  const removeValue = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  // Update content field
  const updateField = (field: keyof AboutContent, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle team member changes
  const handleTeamMemberChange = (field: keyof TeamMember, value: string) => {
    if (!editingTeamMember) return;
    
    setEditingTeamMember(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  // Save team member
  const saveTeamMember = () => {
    if (!editingTeamMember) return;
    
    if (isAddingTeamMember) {
      // Add new team member
      setAboutContent(prev => ({
        ...prev,
        team: [...prev.team, editingTeamMember]
      }));
    } else {
      // Update existing team member
      setAboutContent(prev => ({
        ...prev,
        team: prev.team.map(member => 
          member.id === editingTeamMember.id ? editingTeamMember : member
        )
      }));
    }
    
    cancelTeamMemberEdit();
  };

  // Start editing team member
  const startEditingTeamMember = (member: TeamMember) => {
    setEditingTeamMember({ ...member });
    setIsAddingTeamMember(false);
  };

  // Cancel team member edit
  const cancelTeamMemberEdit = () => {
    setEditingTeamMember(null);
    setIsAddingTeamMember(false);
  };

  // Start adding new team member
  const startAddingTeamMember = () => {
    setEditingTeamMember({
      id: `team-${Date.now()}`,
      name: '',
      position: '',
      bio: '',
      imageUrl: '/assets/placeholder.jpg'
    });
    setIsAddingTeamMember(true);
  };

  // Delete team member
  const deleteTeamMember = (id: string) => {
    setAboutContent(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== id)
    }));
  };

  // Handle team member image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTeamMember) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload the file to your server or cloud storage
      const imageUrl = URL.createObjectURL(files[0]);
      
      setEditingTeamMember(prev => ({
        ...prev!,
        imageUrl
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-charcoal">Manage About Section</h1>
        <p className="mt-2 text-charcoal/70">
          Update the content of your About page, including your story, mission, values, and team.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="border-b border-gray-200 mb-6"
      >
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'story', label: 'Our Story' },
            { id: 'team', label: 'Team' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'story' | 'team')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === tab.id
                  ? 'border-gold text-gold'
                  : 'border-transparent text-charcoal/70 hover:text-charcoal hover:border-gray-200'
              } transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Main Content</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="heading" className="block text-sm font-medium text-charcoal mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    id="heading"
                    value={aboutContent.heading}
                    onChange={(e) => updateField('heading', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="subheading" className="block text-sm font-medium text-charcoal mb-1">
                    Subheading
                  </label>
                  <input
                    type="text"
                    id="subheading"
                    value={aboutContent.subheading}
                    onChange={(e) => updateField('subheading', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="mainContent" className="block text-sm font-medium text-charcoal mb-1">
                    Main Content
                  </label>
                  <textarea
                    id="mainContent"
                    value={aboutContent.mainContent}
                    onChange={(e) => updateField('mainContent', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Mission, Vision & Values</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="mission" className="block text-sm font-medium text-charcoal mb-1">
                    Mission
                  </label>
                  <textarea
                    id="mission"
                    value={aboutContent.mission}
                    onChange={(e) => updateField('mission', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="vision" className="block text-sm font-medium text-charcoal mb-1">
                    Vision
                  </label>
                  <textarea
                    id="vision"
                    value={aboutContent.vision}
                    onChange={(e) => updateField('vision', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Values
                  </label>
                  <div className="space-y-2 mb-4">
                    {aboutContent.values.map((value, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md"
                      >
                        <span className="text-sm text-charcoal">{value}</span>
                        <button
                          onClick={() => removeValue(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex">
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Add a new value..."
                      className="flex-grow px-4 py-2 border border-gray-200 rounded-l-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                    />
                    <button
                      onClick={addValue}
                      className="px-4 py-2 bg-charcoal text-white rounded-r-md hover:bg-charcoal/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Story Tab */}
        {activeTab === 'story' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-charcoal mb-4">Our Story</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="storyTitle" className="block text-sm font-medium text-charcoal mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  id="storyTitle"
                  value={aboutContent.storyTitle}
                  onChange={(e) => updateField('storyTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="storyContent" className="block text-sm font-medium text-charcoal mb-1">
                  Story Content
                </label>
                <textarea
                  id="storyContent"
                  value={aboutContent.storyContent}
                  onChange={(e) => updateField('storyContent', e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                  placeholder="Tell your brand's story..."
                />
              </div>
              
              <p className="text-xs text-charcoal/60">
                Tip: Share your journey, challenges, and accomplishments. Personal stories help connect with your customers.
              </p>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div>
            {editingTeamMember ? (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-charcoal mb-4">
                  {isAddingTeamMember ? 'Add Team Member' : 'Edit Team Member'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={editingTeamMember.name}
                        onChange={(e) => handleTeamMemberChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-charcoal mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        id="position"
                        value={editingTeamMember.position}
                        onChange={(e) => handleTeamMemberChange('position', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-charcoal mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={editingTeamMember.bio}
                        onChange={(e) => handleTeamMemberChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Profile Image
                    </label>
                    <div className="space-y-3">
                      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={editingTeamMember.imageUrl}
                          alt={editingTeamMember.name || 'Team member'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-charcoal hover:bg-gray-50 transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    onClick={cancelTeamMemberEdit}
                    className="px-4 py-2 border border-gray-200 rounded-md text-charcoal hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveTeamMember}
                    className="px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors"
                  >
                    {isAddingTeamMember ? 'Add Member' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={startAddingTeamMember}
                  className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Team Member
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutContent.team.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative w-full aspect-square bg-gray-100">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-charcoal">{member.name}</h3>
                    <p className="text-sm text-gold mb-2">{member.position}</p>
                    <p className="text-sm text-charcoal/70 mb-4">{member.bio}</p>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => startEditingTeamMember(member)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteTeamMember(member.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-8 flex justify-end"
      >
        <button
          onClick={saveChanges}
          disabled={saving}
          className={`px-6 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors flex items-center ${
            saving ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {saving && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.div>
    </div>
  );
} 