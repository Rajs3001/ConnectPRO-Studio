
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Mail, MessageSquare, Phone, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Import animation library

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission success
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!name || !email || !feedback) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill in your name, email, and feedback.",
        });
        setIsSubmitting(false);
        return;
    }

    console.log('Submitting Feedback:', { name, email, phone, feedback });

    // TODO: Implement actual feedback submission API call here
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    const submitSuccess = true; // Placeholder for success

    if (submitSuccess) {
        setIsSubmitted(true); // Show success animation
        // Clear form
        setName('');
        setEmail('');
        setPhone('');
        setFeedback('');

        // Close modal after animation
        setTimeout(() => {
            setIsSubmitted(false); // Reset animation state
            setIsOpen(false); // Close the dialog
        }, 2500); // Duration of the success animation + delay
    } else {
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "Could not submit your feedback. Please try again later.",
        });
    }
    setIsSubmitting(false);
  };

  // Variants for success animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const successVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 10 } },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" data-testid="feedback-trigger-button">
          Provide Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]" data-testid="feedback-dialog-content">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              data-testid="feedback-success-message"
            >
              <motion.div variants={successVariants}>
                <CheckCircle className="h-16 w-16 text-green-500 mb-4 mx-auto" />
                <h2 className="text-xl font-semibold mb-2">Feedback Submitted!</h2>
                <p className="text-muted-foreground">Thank you for helping us improve ConnectPro.</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="form" data-testid="feedback-form-container">
              <DialogHeader>
                <DialogTitle data-testid="feedback-dialog-title">Connect PRO Feedback</DialogTitle>
                <DialogDescription data-testid="feedback-dialog-description">
                  Share your thoughts to help us make ConnectPro better.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} data-testid="feedback-form">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right col-span-1 flex items-center gap-1 justify-end">
                      <User size={14} /> Name*
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                      required
                      disabled={isSubmitting}
                      data-testid="feedback-name-input"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right col-span-1 flex items-center gap-1 justify-end">
                      <Mail size={14} /> Email*
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="col-span-3"
                      required
                      disabled={isSubmitting}
                      data-testid="feedback-email-input"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="phone" className="text-right col-span-1 flex items-center gap-1 justify-end">
                      <Phone size={14} /> Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="col-span-3"
                      disabled={isSubmitting}
                      data-testid="feedback-phone-input"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                     <Label htmlFor="feedback" className="text-right col-span-1 pt-2 flex items-center gap-1 justify-end">
                      <MessageSquare size={14} /> Feedback*
                    </Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="col-span-3 min-h-[100px]"
                      required
                      disabled={isSubmitting}
                      placeholder="Tell us what you think..."
                      data-testid="feedback-textarea"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting} data-testid="feedback-cancel-button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting} data-testid="feedback-submit-button">
                    {isSubmitting ? 'Submitting...' : <><Send size={16} className="mr-2"/> Submit Feedback</>}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
