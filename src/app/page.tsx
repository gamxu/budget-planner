"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Save, RotateCcw, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  color: string;
  inputMode: "amount" | "percentage";
}

const defaultCategories: BudgetCategory[] = [
  {
    id: "rent",
    name: "Rent/Housing",
    amount: 0,
    color: "bg-red-500",
    inputMode: "percentage",
  },
  {
    id: "food",
    name: "Food & Dining",
    amount: 0,
    color: "bg-orange-500",
    inputMode: "percentage",
  },
  {
    id: "savings",
    name: "Savings",
    amount: 0,
    color: "bg-green-500",
    inputMode: "percentage",
  },
  {
    id: "investment",
    name: "Investment",
    amount: 0,
    color: "bg-blue-500",
    inputMode: "percentage",
  },
  {
    id: "transportation",
    name: "Transportation",
    amount: 0,
    color: "bg-purple-500",
    inputMode: "percentage",
  },
  {
    id: "utilities",
    name: "Utilities",
    amount: 0,
    color: "bg-yellow-500",
    inputMode: "amount",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    amount: 0,
    color: "bg-pink-500",
    inputMode: "percentage",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    amount: 0,
    color: "bg-teal-500",
    inputMode: "amount",
  },
];

export default function Home() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [categories, setCategories] =
    useState<BudgetCategory[]>(defaultCategories);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false);

  // Available colors for new categories
  const availableColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-rose-500",
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("budgetCalculator");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setMonthlyIncome(parsed.monthlyIncome || 0);
        setCategories(parsed.categories || defaultCategories);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = () => {
    const dataToSave = {
      monthlyIncome,
      categories,
    };
    localStorage.setItem("budgetCalculator", JSON.stringify(dataToSave));
    toast.success("Budget saved successfully", {
      description: "Your budget has been saved to local storage",
    });
  };

  // Reset all data
  const resetData = () => {
    setMonthlyIncome(0);
    setCategories(defaultCategories);
    setNewCategoryName("");
    setShowAddCategory(false);
    localStorage.removeItem("budgetCalculator");
    toast.success("Budget reset to default", {
      description: "All data has been reset to default",
    });
  };

  // Add new category
  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: BudgetCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        amount: 0,
        color: availableColors[categories.length % availableColors.length],
        inputMode: "percentage",
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setShowAddCategory(false);
      toast.success("Category added successfully");
    }
  };

  // Delete category
  const deleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  // Update category input mode
  const updateCategoryInputMode = (
    id: string,
    inputMode: "amount" | "percentage"
  ) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, inputMode } : cat))
    );
  };

  // Update category amount
  const updateCategory = (id: string, value: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, amount: value } : cat))
    );
  };

  // Calculate totals
  const totalAllocated = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remaining = monthlyIncome - totalAllocated;
  const totalPercentage =
    monthlyIncome > 0 ? (totalAllocated / monthlyIncome) * 100 : 0;

  // Convert between amount and percentage
  const getPercentage = (amount: number) => {
    return monthlyIncome > 0
      ? ((amount / monthlyIncome) * 100).toFixed(1)
      : "0";
  };

  const getAmountFromPercentage = (percentage: number) => {
    return (monthlyIncome * percentage) / 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
            <Image
              className="rounded-full"
              src="/logo.avif"
              alt="logo"
              width={60}
              height={60}
            />
            <h1 className="text-3xl font-bold text-gray-900">Calculator</h1>
          </div>

          <p className="text-gray-600">
            Plan how much you want to spend in each category.
          </p>
        </div>

        {/* Income Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="income">Enter your monthly income</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="50000"
                  value={monthlyIncome || ""}
                  onChange={(e) =>
                    setMonthlyIncome(Number(e.target.value) || 0)
                  }
                  className="text-sm"
                  size={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600">
                  ฿{monthlyIncome.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Monthly Income</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-4xl font-bold text-orange-600">
                  ฿{totalAllocated.toLocaleString()}
                </div>
                <div className="text-sm text-orange-600">Total Allocated</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600">
                  ฿{remaining.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Remaining</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Budget Allocation</span>
                <span>{totalPercentage.toFixed(1)}%</span>
              </div>
              <Progress
                value={Math.min(totalPercentage, 100)}
                className="h-3"
              />
              {totalPercentage > 100 && (
                <Badge variant="destructive" className="text-xs">
                  Over budget by {(totalPercentage - 100).toFixed(1)}%
                </Badge>
              )}
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Budget Allocation</h3>

              {/* Single Stacked Bar */}
              <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden flex">
                {categories
                  .filter((cat) => cat.amount > 0)
                  .map((category) => (
                    <div
                      key={category.id}
                      className={`${category.color} h-full`}
                      style={{
                        width: `${(category.amount / monthlyIncome) * 100}%`,
                      }}
                      title={`${
                        category.name
                      }: ฿${category.amount.toLocaleString()} (${getPercentage(
                        category.amount
                      )}%)`}
                    />
                  ))}
                {remaining > 0 && (
                  <div
                    className="bg-gray-300 h-full"
                    style={{ width: `${(remaining / monthlyIncome) * 100}%` }}
                    title={`Unallocated: ฿${remaining.toLocaleString()} (${(
                      (remaining / monthlyIncome) *
                      100
                    ).toFixed(1)}%)`}
                  />
                )}
              </div>

              {/* Category Legend */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categories
                  .filter((cat) => cat.amount > 0)
                  .sort((a, b) => b.amount - a.amount)
                  .map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${category.color}`}
                        />
                        <span className="font-medium text-sm">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">
                          ฿{category.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({getPercentage(category.amount)}%)
                        </span>
                      </div>
                    </div>
                  ))}

                {remaining !== 0 && (
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          remaining > 0 ? "bg-gray-300" : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium text-sm">
                        {remaining > 0 ? "Unallocated" : "Over Budget"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold text-lg ${
                          remaining > 0 ? "text-blue-600" : "text-red-600"
                        }`}
                      >
                        ฿{Math.abs(remaining).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        (
                        {((Math.abs(remaining) / monthlyIncome) * 100).toFixed(
                          1
                        )}
                        %)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Budget Categories
              <Button
                onClick={() => setShowAddCategory(!showAddCategory)}
                size="sm"
                variant="outline"
              >
                Add Category
              </Button>
            </CardTitle>
            <CardDescription>
              Allocate your income across different spending categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showAddCategory && (
              <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCategory()}
                    size={10}
                  />
                  <Button onClick={addCategory} size="sm">
                    Add
                  </Button>
                  <Button
                    onClick={() => setShowAddCategory(false)}
                    variant="outline"
                    size="default"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="space-y-3 p-4 border rounded-lg relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${category.color}`}
                      />
                      <Label className="font-medium">{category.name}</Label>
                    </div>
                    <Button
                      onClick={() => deleteCategory(category.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>

                  <div className="flex gap-1 mb-2">
                    <Button
                      variant={
                        category.inputMode === "percentage"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateCategoryInputMode(category.id, "percentage")
                      }
                      className="flex items-center gap-1 text-xs px-2 py-1 h-6 w-[100px]"
                    >
                      Percentage
                    </Button>
                    <Button
                      variant={
                        category.inputMode === "amount" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateCategoryInputMode(category.id, "amount")
                      }
                      className="flex items-center gap-1 text-xs px-2 py-1 h-6 w-[100px]"
                    >
                      Fixed Amount
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {category.inputMode === "percentage" ? (
                      <div className="space-y-1">
                        <Input
                          type="number"
                          placeholder="0"
                          value={
                            monthlyIncome > 0
                              ? getPercentage(category.amount)
                              : ""
                          }
                          onChange={(e) => {
                            const percentage = Number(e.target.value) || 0;
                            const amount = getAmountFromPercentage(percentage);
                            updateCategory(category.id, amount);
                          }}
                          className="text-right text-sm"
                          size={10}
                        />
                        <div className="text-lg font-semibold text-gray-700 text-right">
                          = ฿{category.amount.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Input
                          type="number"
                          placeholder="0"
                          value={category.amount || ""}
                          onChange={(e) =>
                            updateCategory(
                              category.id,
                              Number(e.target.value) || 0
                            )
                          }
                          className="text-right text-sm"
                          size={10}
                        />
                        <div className="text-lg font-semibold text-gray-700 text-right">
                          = {getPercentage(category.amount)}%
                        </div>
                      </div>
                    )}

                    {/* <Progress
                      value={
                        monthlyIncome > 0
                          ? (category.amount / monthlyIncome) * 100
                          : 0
                      }
                      className="h-2"
                    /> */}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Budget
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save Budget</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save your current budget? This will
                  overwrite any previously saved data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={saveData}>Save</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Budget</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reset all data? This action cannot be
                  undone and will delete all your current budget settings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetData}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
