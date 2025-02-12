import React from 'react';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogDescription,
} from '@/components/ui/morphing-dialog';

export default function TestMorphingDialog() {
  return (
    <div className="min-h-[3000px] p-4">
      <div className="sticky top-4">
        <MorphingDialog>
          <MorphingDialogTrigger>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Open Dialog
            </div>
          </MorphingDialogTrigger>
          
          <MorphingDialogContainer>
            <MorphingDialogContent>
              <div className="p-6">
                <MorphingDialogTitle>
                  <h2 className="text-2xl font-bold">Test Dialog</h2>
                </MorphingDialogTitle>
                
                <MorphingDialogDescription>
                  <p className="mt-4">
                    This is a test dialog to verify scroll position behavior.
                  </p>
                </MorphingDialogDescription>
                
                <MorphingDialogClose />
              </div>
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      </div>
      
      <div className="mt-[2000px] text-center text-gray-500">
        Bottom of the page
      </div>
    </div>
  );
} 