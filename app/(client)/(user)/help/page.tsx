import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  HelpCircle,
  ChevronRight,
  Search,
} from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Help",
};
export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-tech_white my-5">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Help Center
          </h1>
          <p className="text-muted-foreground">
            Find answers, get support, and resolve issues with your orders.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 w-full md:w-2/3 lg:w-1/2"
            placeholder="Search for help topics..."
            type="search"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Emergency Contact
              </CardTitle>
              <CardDescription>
                Get immediate assistance for urgent issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-medium">Customer Support Hotline</div>
              <div className="text-lg font-bold">1-800-SHOP-HELP</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Available 24/7 for emergencies
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Call Now
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Support
              </CardTitle>
              <CardDescription>
                Get help via email for non-urgent issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-medium">Customer Service Email</div>
              <div className="text-lg font-bold">support@Shoptech.com</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Response within 24 hours
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Live Chat
              </CardTitle>
              <CardDescription>
                Chat with our support team in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-medium">Chat Support Hours</div>
              <div className="text-lg font-bold">9 AM - 9 PM (Mon-Sat)</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Average wait time: 2 minutes
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Chat</Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="faq" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to the most common questions about our services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      How do I track my order?
                    </AccordionTrigger>
                    <AccordionContent>
                      You can track your order by logging into your account and
                      visiting the Order History section. Alternatively, you can
                      use the tracking number provided in your shipping
                      confirmation email.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      What payment methods do you accept?
                    </AccordionTrigger>
                    <AccordionContent>
                      We accept all major credit cards (Visa, Mastercard,
                      American Express), PayPal, Apple Pay, and Google Pay. For
                      select regions, we also offer buy-now-pay-later options.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How long will shipping take?
                    </AccordionTrigger>
                    <AccordionContent>
                      Standard shipping typically takes 3-5 business days within
                      the continental US. Express shipping (1-2 business days)
                      and international shipping options are also available.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      What is your return policy?
                    </AccordionTrigger>
                    <AccordionContent>
                      We offer a 30-day return policy for most items. Products
                      must be in their original condition with tags attached.
                      Some items like intimate apparel or personalized products
                      may not be eligible for return.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      Do you ship internationally?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, we ship to over 100 countries worldwide.
                      International shipping rates and delivery times vary by
                      location. You can see the shipping options available to
                      your country during checkout.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Help</CardTitle>
                <CardDescription>
                  Get assistance with your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="order-1">
                    <AccordionTrigger>
                      How do I cancel my order?
                    </AccordionTrigger>
                    <AccordionContent>
                      If your order hasn&apos;t shipped yet, you can cancel it
                      by going to your account&apos;s Order History section and
                      selecting Cancel Order. If it has already shipped,
                      you&apos;ll need to initiate a return once you receive it.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="order-2">
                    <AccordionTrigger>
                      Can I modify my order after placing it?
                    </AccordionTrigger>
                    <AccordionContent>
                      Order modifications (such as changing size, color, or
                      shipping address) may be possible if the order hasn&apos;t
                      been processed yet. Please contact customer service
                      immediately with your order number.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="order-3">
                    <AccordionTrigger>
                      What if my order arrives damaged?
                    </AccordionTrigger>
                    <AccordionContent>
                      If your order arrives damaged, please take photos of the
                      damaged items and packaging, and contact our customer
                      service within 48 hours of delivery. We&apos;ll arrange a
                      replacement or refund.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="order-4">
                    <AccordionTrigger>
                      My order is missing items. What should I do?
                    </AccordionTrigger>
                    <AccordionContent>
                      If items are missing from your order, please check your
                      order confirmation to verify what was purchased. If items
                      are indeed missing, contact customer service with your
                      order number for immediate assistance.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="returns" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Returns & Refunds</CardTitle>
                <CardDescription>
                  Information about our return and refund processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="return-1">
                    <AccordionTrigger>
                      How do I start a return?
                    </AccordionTrigger>
                    <AccordionContent>
                      To initiate a return, log into your account, go to Order
                      History, select the order containing the item(s) you wish
                      to return, and click Return Items. Follow the prompts to
                      complete the return request.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="return-2">
                    <AccordionTrigger>
                      How long do refunds take to process?
                    </AccordionTrigger>
                    <AccordionContent>
                      Once we receive your returned items, it typically takes
                      3-5 business days to process the return. After processing,
                      refunds usually appear in your account within 5-10
                      business days, depending on your payment method and
                      financial institution.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="return-3">
                    <AccordionTrigger>
                      Do I have to pay for return shipping?
                    </AccordionTrigger>
                    <AccordionContent>
                      For standard returns, customers are responsible for return
                      shipping costs unless the return is due to our error
                      (wrong item shipped, defective product, etc.). Premium
                      members receive free return shipping on all orders.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="return-4">
                    <AccordionTrigger>
                      Can I exchange an item instead of returning it?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, you can request an exchange for a different size or
                      color of the same item during the return process. If the
                      item you want is in stock, we&apos;ll ship it once we
                      receive your return.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Visit Our Store
              </CardTitle>
              <CardDescription>
                Get in-person assistance at our locations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium">Main Store - New York</div>
                <div className="text-sm text-muted-foreground">
                  123 Shopping Avenue, New York, NY 10001
                </div>
                <div className="text-sm text-muted-foreground">
                  Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 6 PM
                </div>
              </div>
              <div>
                <div className="font-medium">
                  West Coast Branch - Los Angeles
                </div>
                <div className="text-sm text-muted-foreground">
                  456 Retail Boulevard, Los Angeles, CA 90001
                </div>
                <div className="text-sm text-muted-foreground">
                  Mon-Sat: 10 AM - 9 PM, Sun: 11 AM - 6 PM
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Find Nearest Store
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Additional Resources
              </CardTitle>
              <CardDescription>Explore more ways to get help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Link
                  href="#"
                  className="flex items-center justify-between group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">
                    Size Guide
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-between group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">
                    Shipping Information
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-between group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">
                    Product Care Instructions
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-between group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">
                    Gift Card Balance
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Resources
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>
              Our customer service team is here to assist you with any questions
              or concerns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center p-4 text-center border rounded-lg">
                <Phone className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-lg font-medium">Call Us</h3>
                <p className="text-sm text-muted-foreground">
                  Speak directly with our support team
                </p>
                <Button className="mt-4">1-800-SHOP-HELP</Button>
              </div>
              <div className="flex flex-col items-center justify-center p-4 text-center border rounded-lg">
                <MessageSquare className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-lg font-medium">Message Us</h3>
                <p className="text-sm text-muted-foreground">
                  Send us a message and we&apos;ll get back to you
                </p>
                <Button variant="outline" className="mt-4">
                  Contact Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
