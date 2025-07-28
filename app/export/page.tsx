import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, Download, Database } from "lucide-react"
import Link from "next/link"

export default function ExportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Data Export</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Export education data in various formats for further analysis
            </p>
          </div>
        </div>

        <div className="text-center py-16">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-8 rounded-full inline-block mb-6">
            <FileText className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Data Export Tools Coming Soon
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Download OECS education data in multiple formats for research, analysis, and reporting purposes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-indigo-500 p-3 rounded-lg w-fit">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <CardTitle>CSV Export</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Export data in CSV format for spreadsheet analysis and reporting.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-blue-500 p-3 rounded-lg w-fit">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <CardTitle>API Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access data programmatically through RESTful APIs for integration.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-green-500 p-3 rounded-lg w-fit">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Report Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate comprehensive reports in PDF and other formats.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 